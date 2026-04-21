export const CloudinaryConfig = {
   // CONFIGURACIÓN DE CLOUDINARY - DEBES ACTUALIZAR ESTOS VALORES

   // 1. Cloud Name: Nombre de tu cuenta de Cloudinary
   // Lo encuentras en tu dashboard de Cloudinary
   CLOUD_NAME: 'dmge8mmy9',

   // 2. API Key: Llave de API de tu cuenta
   // Lo encuentras en tu dashboard de Cloudinary > Settings > API Keys
   API_KEY: 'fAjRObVJVTjHQbm9A3_vl14-OPg',

   // 3. API Secret: Clave secreta para firmar URLs (opcional)
   // Lo encuentras en tu dashboard de Cloudinary > Settings > API Keys
   API_SECRET: '', // Agrega tu API Secret aquí si necesitas URLs firmadas

   // 4. Upload Preset: Configuración predefinida para subir archivos
   // Debes crearlo en tu dashboard de Cloudinary > Settings > Upload > Upload presets
   // - Dale un nombre (ej: 'product-images')
   // - Configúralo como "Unsigned" si no quieres autenticación
   // - Permitir solo imágenes
   // - Establecer carpeta destino (ej: 'product-images')
   UPLOAD_PRESET: 'pinceladas_upload',

   // 5. Folder: Carpeta donde se guardarán las imágenes
   FOLDER: 'fotos-productos',

   // 6. Public Access: Configuración para acceso público
   PUBLIC_ACCESS: true // Activa esto para hacer las imágenes públicas
};

// INSTRUCCIONES DE CONFIGURACIÓN:
/*
1. Ve a https://cloudinary.com/ y crea una cuenta o inicia sesión
2. En tu dashboard, copia tu "Cloud Name"
3. Ve a Settings > API Keys y copia tu "API Key"
4. Ve a Settings > Upload > Upload presets y crea un nuevo preset:
   - Nombre: elijas uno (ej: 'product-images')
   - Signing mode: Unsigned (para facilitar el uso)
   - Allowed formats: jpg, jpeg, png, gif, webp
   - Destination folder: 'product-images'
5. Actualiza los valores arriba con tus credenciales

6. Para el Media Library (opcional pero recomendado):
   - Habilita el Media Library en tu cuenta de Cloudinary
   - Configura las restricciones de acceso si es necesario

7. Una vez configurado, el botón "Seleccionar Imágenes de Cloudinary" mostrará
   todas tus imágenes de Cloudinary cuando lo presiones.
*/
