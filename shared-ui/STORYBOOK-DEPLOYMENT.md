# Despliegue de Storybook

Este documento proporciona instrucciones para desplegar el Storybook de la biblioteca de componentes en diferentes plataformas.

## Configuración actualizada

Hemos realizado los siguientes cambios para resolver los problemas de construcción:

1. Agregado todas las dependencias necesarias de Storybook en `package.json`
2. Simplificado la configuración de Storybook en `.storybook/main.js`
3. Agregado un archivo `.babelrc` específico para el proyecto
4. Configurado Netlify para usar `--legacy-peer-deps` durante la instalación

## Opciones de despliegue

### 1. Netlify (Recomendado)

#### Despliegue manual

1. Sube tu repositorio a GitHub, GitLab o Bitbucket.

2. Conéctate a Netlify:

   - Crea una cuenta en [Netlify](https://www.netlify.com/)
   - Haz clic en "New site from Git"
   - Selecciona tu proveedor de Git y autoriza a Netlify
   - Selecciona el repositorio

3. Configura las opciones de despliegue:

   - **Base directory**: `poc-monorepo/shared-ui/` (ajusta según la estructura de tu proyecto)
   - **Build command**: `npm install --legacy-peer-deps && npm run build-storybook`
   - **Publish directory**: `storybook-static`

4. Haz clic en "Deploy site"

#### Despliegue con Netlify Drop (alternativa rápida)

Si tienes problemas con el despliegue continuo, puedes usar Netlify Drop:

1. Clona el repositorio localmente y navega al directorio del proyecto.
2. Instala las dependencias: `npm install --legacy-peer-deps`
3. Construye Storybook: `npm run build-storybook`
4. Una vez que tengas la carpeta `storybook-static`:
   - Ve a [Netlify Drop](https://app.netlify.com/drop)
   - Arrastra y suelta la carpeta `storybook-static`

### 2. Vercel

1. Conecta tu repositorio a Vercel:

   - Crea una cuenta en [Vercel](https://vercel.com/)
   - Importa tu proyecto desde Git
   - Selecciona el repositorio

2. Configura las opciones de despliegue:

   - **Framework Preset**: Other
   - **Root Directory**: `poc-monorepo/shared-ui/` (ajusta según la estructura de tu proyecto)
   - **Build Command**: `npm install --legacy-peer-deps && npm run build-storybook`
   - **Output Directory**: `storybook-static`

3. Haz clic en "Deploy"

## Personalización

### Configuración de dominio personalizado

Tanto Netlify como Vercel permiten configurar dominios personalizados:

1. En Netlify:

   - Ve a "Domain settings"
   - Haz clic en "Add custom domain"
   - Sigue las instrucciones para configurar tu dominio

2. En Vercel:
   - Ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado
   - Sigue las instrucciones para configurar los registros DNS

## Solución de problemas

### Problemas comunes

1. **Error de dependencias faltantes**:

   - Asegúrate de que todas las dependencias de Storybook estén instaladas en `package.json`
   - Usa la opción `--legacy-peer-deps` para evitar problemas de compatibilidad

2. **Error de configuración de Storybook**:

   - Verifica que los archivos `.storybook/main.js` y `.storybook/preview.js` existan y estén correctamente configurados
   - Asegúrate de que el directorio `public` exista, incluso si está vacío

3. **Problemas con Babel**:
   - Verifica que el archivo `.babelrc` esté correctamente configurado
   - Asegúrate de que las dependencias de Babel estén instaladas

Para más información, consulta la [documentación oficial de Storybook](https://storybook.js.org/docs/react/sharing/publish-storybook).
