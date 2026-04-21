import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../../../core/models/product.models";
import { Category } from "../../../core/models/category.models";
import { Provider } from "../../../core/models/provider.models";
import { ProductService } from "../../../core/services/product.service";
import { CategoryService } from "../../../core/services/category.service";
import { ProviderService } from "../../../core/services/provider.service";
import { MessageService } from "primeng/api";
import {
  CloudinaryService,
  CloudinaryImage,
} from "../../../core/services/cloudinary.service";
import Quill from "quill";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  productForm: FormGroup;
  isEdit: boolean = false;
  loading: boolean = false;
  productId: number | null = null;

  categories: Category[] = [];
  providers: Provider[] = [];
  imagenesSeleccionadas: string[] = [];
  loadingImages: boolean = false;

  @ViewChild("descripcion") editorElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private messageService: MessageService,
    private cloudinaryService: CloudinaryService,
    private cdr: ChangeDetectorRef,
  ) {
    this.productForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      descripcion: ["", [Validators.required, Validators.minLength(10)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidadStock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, [Validators.required]],
      proveedorId: [null, [Validators.required]],
      urlDrive: [""],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProviders();

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  ngAfterViewInit(): void {
    // Forzar la actualización del editor cuando se carga un producto existente
    if (this.isEdit && this.productId) {
      setTimeout(() => {
        const descripcionControl = this.productForm.get("descripcion");
        if (descripcionControl && descripcionControl.value) {
          // Forzar la detección de cambios para que el editor muestre el contenido
          descripcionControl.setValue(descripcionControl.value);
          this.cdr.detectChanges();

          // Método alternativo para PrimeNG 15 con Quill 2.x
          setTimeout(() => {
            const editorElement = document.querySelector(
              "#descripcion .ql-editor",
            );
            if (editorElement && descripcionControl.value) {
              editorElement.innerHTML = descripcionControl.value;
            }
          }, 100);
        }
      }, 100);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.filter((cat) => cat.estado);
      },
      error: (error: any) => {
        console.error("Error loading categories:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar las categorías",
        });
      },
    });
  }

  loadProviders(): void {
    this.providerService.getAllProviders().subscribe({
      next: (data: Provider[]) => {
        this.providers = data;
      },
      error: (error: any) => {
        console.error("Error loading providers:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los proveedores",
        });
      },
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        // Convertir URL de Cloudinary a URL segura si existe
        let urlDriveDirecta = "";
        if (product.urlDrive) {
          // Si hay URLs concatenadas, separarlas y convertirlas
          const urls = product.urlDrive.split(",");
          const convertedUrls = urls.map((url) =>
            this.cloudinaryService.convertToSecureUrl(url.trim()),
          );
          this.imagenesSeleccionadas = convertedUrls;
          urlDriveDirecta = product.urlDrive; // Mantener el formato original para el formulario
        }

        this.productForm.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          cantidadStock: product.cantidadStock,
          categoriaId: product.categoriaId ?? product.categoria?.id,
          proveedorId: product.proveedorId ?? product.proveedor?.id,
          urlDrive: urlDriveDirecta,
        });

        // Forzar la actualización del editor después de un pequeño retraso
        setTimeout(() => {
          const descripcionControl = this.productForm.get("descripcion");
          if (descripcionControl && product.descripcion) {
            descripcionControl.setValue(product.descripcion);
            this.cdr.detectChanges(); // Forzar detección de cambios

            // Método alternativo para PrimeNG 15 con Quill 2.x
            setTimeout(() => {
              const editorElement = document.querySelector(
                "#descripcion .ql-editor",
              );
              if (editorElement && product.descripcion) {
                editorElement.innerHTML = product.descripcion;
              }
            }, 100);
          }
        }, 200);

        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading product:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar el producto",
        });
        this.loading = false;
      },
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const productData = this.productForm.value;

    if (this.isEdit && this.productId) {
      const updateRequest: UpdateProductRequest = {
        id: this.productId,
        ...productData,
      };

      this.productService.updateProduct(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Producto actualizado correctamente",
          });
          this.loading = false;
          this.router.navigate(["/products"]);
        },
        error: (error: any) => {
          console.error("Error updating product:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No se pudo actualizar el producto",
          });
          this.loading = false;
        },
      });
    } else {
      const createRequest: CreateProductRequest = productData;

      this.productService.createProduct(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Producto creado correctamente",
          });
          this.loading = false;
          this.router.navigate(["/products"]);
        },
        error: (error: any) => {
          console.error("Error creating product:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No se pudo crear el producto",
          });
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }

  onImageError(event: any): void {
    const originalSrc = event.target.src;

    // Try to fix the URL if it's a Google Drive URL
    if (originalSrc.includes("drive.google.com")) {
      this.fixImageURL(originalSrc).then((fixedUrl) => {
        if (fixedUrl !== originalSrc) {
          event.target.src = fixedUrl;
        } else {
          event.target.src = "assets/images/img_no_found.png";
          this.messageService.add({
            severity: "warn",
            summary: "Advertencia",
            detail:
              "La imagen no pudo cargarse. Verifica que el archivo sea público en Google Drive.",
          });
        }
      });
    } else {
      event.target.src = "assets/images/img_no_found.png";
    }
  }

  private async fixImageURL(url: string): Promise<string> {
    try {
      const workingUrl = await this.cloudinaryService.convertToSecureUrl(url);
      return workingUrl;
    } catch {
      return url;
    }
  }

  async validateImages(): Promise<void> {
    if (this.imagenesSeleccionadas.length === 0) return;
    const validImages: string[] = [];

    for (const imageUrl of this.imagenesSeleccionadas) {
      const isValid = await this.cloudinaryService.testImageUrl(imageUrl);
      if (isValid) {
        validImages.push(imageUrl);
      } else {
        console.warn("Imagen inválida:", imageUrl);
      }
    }

    if (validImages.length !== this.imagenesSeleccionadas.length) {
      this.imagenesSeleccionadas = validImages;
      // Actualizar urlDrive con todas las URLs válidas concatenadas
      const allUrlsString = validImages.join(",");
      this.productForm.patchValue({ urlDrive: allUrlsString });
      this.messageService.add({
        severity: "info",
        summary: "Información",
        detail: `Se eliminaron ${this.imagenesSeleccionadas.length - validImages.length} imágenes que no pudieron cargarse`,
      });
    }
  }

  async verImagenesExistentes(): Promise<void> {
    this.loadingImages = true;

    // Usar el método manual para ver imágenes existentes
    this.cloudinaryService.getExistingImages().subscribe({
      next: async (images: CloudinaryImage[]) => {
        if (images.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Información",
            detail: "No se ingresaron URLs de imágenes",
          });
          this.loadingImages = false;
          return;
        }

        // Agregar todas las URLs ingresadas
        const urlsSeguras: string[] = [];

        for (const image of images) {
          try {
            const secureUrl = this.cloudinaryService.convertToSecureUrl(image.secure_url);
            urlsSeguras.push(secureUrl);
          } catch (error) {
            console.error(`Error procesando imagen ${image.public_id}:`, error);
            urlsSeguras.push(image.secure_url);
          }
        }

        this.imagenesSeleccionadas = [
          ...this.imagenesSeleccionadas,
          ...urlsSeguras,
        ];

        const allUrlsString = this.imagenesSeleccionadas.join(",");
        this.productForm.patchValue({ urlDrive: allUrlsString });

        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: `Se agregaron ${images.length} imágenes desde URLs`,
        });

        this.loadingImages = false;
      },
      error: (error) => {
        console.error("Error al procesar URLs:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron procesar las URLs de imágenes",
        });
        this.loadingImages = false;
      },
    });
  }

  async abrirSelectorCloudinary(): Promise<void> {
    this.loadingImages = true;

    this.cloudinaryService.getAllImages().subscribe({
      next: async (images: CloudinaryImage[]) => {
        const urlsSeguras: string[] = [];

        for (const image of images) {
          try {
            const secureUrl = this.cloudinaryService.convertToSecureUrl(image.secure_url);
            urlsSeguras.push(secureUrl);
          } catch (error) {
            console.error(`Error procesando imagen ${image.public_id}:`, error);
            // Aún así agregamos la URL segura
            urlsSeguras.push(image.secure_url);
          }
        }

        this.imagenesSeleccionadas = [
          ...this.imagenesSeleccionadas,
          ...urlsSeguras,
        ];
        // Concatenar todas las URLs en un solo string separado por comas
        const allUrlsString = this.imagenesSeleccionadas.join(",");
        this.productForm.patchValue({ urlDrive: allUrlsString });
        this.loadingImages = false;

        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: `Se seleccionaron ${images.length} imágenes de Cloudinary`,
        });
      },
      error: (error) => {
        console.error("Error al seleccionar imágenes:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron seleccionar las imágenes de Cloudinary",
        });
        this.loadingImages = false;
      },
    });
  }

  eliminarImagen(index: number): void {
    this.imagenesSeleccionadas.splice(index, 1);
    // Actualizar urlDrive con todas las URLs restantes concatenadas
    const allUrlsString = this.imagenesSeleccionadas.join(",");
    this.productForm.patchValue({ urlDrive: allUrlsString });
  }

  onUrlDriveChange(): void {
    const urlDriveValue = this.urlDrive?.value;
    if (urlDriveValue && (urlDriveValue.includes("cloudinary.com") || urlDriveValue.includes("res.cloudinary.com"))) {
      const secureUrl =
        this.cloudinaryService.convertToSecureUrl(urlDriveValue);
      this.urlDrive?.setValue(secureUrl);
    }
  }

  // Getters para validaciones en el template
  get nombre() {
    return this.productForm.get("nombre");
  }
  get descripcion() {
    return this.productForm.get("descripcion");
  }
  get precio() {
    return this.productForm.get("precio");
  }
  get cantidadStock() {
    return this.productForm.get("cantidadStock");
  }
  get categoriaId() {
    return this.productForm.get("categoriaId");
  }
  get proveedorId() {
    return this.productForm.get("proveedorId");
  }
  get urlDrive() {
    return this.productForm.get("urlDrive");
  }
}
