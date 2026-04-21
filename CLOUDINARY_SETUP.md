# Configuración de Cloudinary para Pinceladas de Belleza Admin

## Resumen de los cambios realizados

Se ha reemplazado la integración de Google Drive por Cloudinary para la gestión de imágenes de productos. Los cambios incluyen:

1. **Instalación de dependencias**: Se agregaron los paquetes `@cloudinary/angular-5.x` y `cloudinary-core`
2. **Nuevo servicio Cloudinary**: `src/app/core/services/cloudinary.service.ts`
3. **Actualización del componente**: `product-form.component.ts` ahora usa Cloudinary
4. **Actualización de la interfaz**: El botón ahora dice "Seleccionar Imágenes de Cloudinary"
5. **Archivo de configuración**: `src/app/core/services/cloudinary-config.ts`

## Configuración necesaria

### Paso 1: Obtener tus credenciales de Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com/) y crea una cuenta o inicia sesión
2. En tu dashboard, copia tu **"Cloud Name"**
3. Ve a **Settings > API Keys** y copia tu **"API Key"**

### Paso 2: Crear un Upload Preset

1. Ve a **Settings > Upload > Upload presets**
2. Crea un nuevo preset con las siguientes configuraciones:
   - **Nombre**: `product-images` (o el que prefieras)
   - **Signing mode**: Unsigned (para facilitar el uso)
   - **Allowed formats**: jpg, jpeg, png, gif, webp
   - **Destination folder**: `product-images`
3. Copia el nombre del preset

### Paso 3: Actualizar el archivo de configuración

Edita el archivo `src/app/core/services/cloudinary-config.ts` y reemplaza los valores:

```typescript
export const CloudinaryConfig = {
  CLOUD_NAME: 'tu-cloud-name',        // Reemplaza con tu Cloud Name
  API_KEY: 'tu-api-key',               // Reemplaza con tu API Key
  UPLOAD_PRESET: 'product-images',     // Reemplaza con tu upload preset
  FOLDER: 'product-images'             // Carpeta destino
};
```

### Paso 4: Opcional - Configurar Media Library

Si quieres ver todas tus imágenes existentes:

1. Habilita el **Media Library** en tu cuenta de Cloudinary
2. Configura las restricciones de acceso si es necesario
3. Sube algunas imágenes de prueba a la carpeta `product-images`

## Funcionalidad

Una vez configurado, al presionar el botón **"Seleccionar Imágenes de Cloudinary"**:

- Se abrirá el widget de Cloudinary mostrando todas tus imágenes
- Podrás seleccionar múltiples imágenes
- Las imágenes seleccionadas se agregarán al producto
- Las URLs se almacenarán en el campo `urlDrive` (manteniendo compatibilidad)

## Características implementadas

- **Selección múltiple**: Puedes seleccionar varias imágenes a la vez
- **Vista previa**: Las imágenes seleccionadas se muestran en una galería
- **Validación**: Sistema de validación de imágenes
- **URLs seguras**: Todas las URLs usan HTTPS
- **Optimización**: Las URLs se optimizan automáticamente
- **Eliminación**: Puedes eliminar imágenes seleccionadas

## Troubleshooting

### El botón no funciona
- Verifica que tus credenciales en `cloudinary-config.ts` sean correctas
- Asegúrate de tener conexión a internet
- Revisa la consola del navegador para ver errores

### No se ven las imágenes
- Verifica que las imágenes existan en tu cuenta de Cloudinary
- Asegúrate de que estén en la carpeta correcta (`product-images`)
- Revisa que el Upload Preset esté configurado correctamente

### Error de autenticación
- Verifica que tu API Key sea válida
- Asegúrate de que el Upload Preset esté configurado como "Unsigned"

## Notas técnicas

- El servicio de Cloudinary está configurado como `providedIn: 'root'`, por lo que no requiere configuración de módulos adicionales
- Se mantiene compatibilidad con el campo `urlDrive` existente en la base de datos
- Las URLs se almacenan concatenadas con comas, igual que con Google Drive
- El widget de Cloudinary se carga dinámicamente para optimizar el rendimiento
