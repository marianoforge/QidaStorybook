# Despliegue de Storybook

Este documento proporciona instrucciones para desplegar el Storybook de la biblioteca de componentes en diferentes plataformas.

## Problemas conocidos y soluciones

Actualmente, hay algunos problemas al construir Storybook localmente debido a configuraciones de TypeScript y Babel. La mejor opción es utilizar servicios de despliegue continuo como Netlify o Vercel, que tienen entornos de construcción más controlados.

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
   - **Build command**: `npm install && npx storybook build`
   - **Publish directory**: `storybook-static`

4. Haz clic en "Deploy site"

#### Despliegue con Netlify Drop (alternativa rápida)

Si tienes problemas con el despliegue continuo, puedes usar Netlify Drop:

1. Clona el repositorio localmente y navega al directorio del proyecto.
2. Instala las dependencias: `npm install`
3. Construye Storybook en un entorno de CI/CD o en una máquina con una configuración diferente.
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
   - **Build Command**: `npm install && npx storybook build`
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

1. **Error en el despliegue**:

   - Verifica que todas las dependencias estén instaladas
   - Asegúrate de que la configuración de Netlify o Vercel sea correcta
   - Revisa los logs de construcción para identificar errores específicos

2. **Estilos o recursos no cargados**:
   - Verifica que las rutas a los recursos sean relativas
   - Asegúrate de que los archivos estáticos estén incluidos en la carpeta `public`

Para más información, consulta la [documentación oficial de Storybook](https://storybook.js.org/docs/react/sharing/publish-storybook).
