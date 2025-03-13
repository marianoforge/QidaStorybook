# Importando un Design System de Figma a Storybook

Este documento explica cómo importar tokens de diseño desde Figma a Storybook y utilizarlos en tus componentes.

## Proceso completo

### 1. Configuración de Figma

1. **Instala el plugin "Figma Tokens"** en Figma:

   - Busca "Figma Tokens" en la sección de plugins de Figma
   - Este plugin te permite definir y exportar tokens de diseño

2. **Define tus tokens de diseño en Figma**:

   - Colores
   - Tipografía
   - Espaciado
   - Bordes
   - Sombras
   - Etc.

3. **Exporta los tokens desde Figma**:
   - Usa el plugin Figma Tokens para exportar en formato JSON
   - Guarda el archivo como `figma-tokens.json` en el directorio `src/tokens/`

### 2. Transformación de tokens

Hay dos enfoques principales:

#### Opción A: Usando Style Dictionary (recomendado para proyectos grandes)

1. **Instala Style Dictionary**:

   ```bash
   npm install --save-dev style-dictionary
   ```

2. **Configura Style Dictionary**:

   - Crea un archivo de configuración que defina cómo transformar los tokens
   - Define las plataformas de salida (CSS, JavaScript, etc.)

3. **Ejecuta la transformación**:
   ```bash
   npm run build:tokens
   ```

#### Opción B: Transformación manual (para proyectos pequeños)

1. **Crea manualmente un archivo CSS con variables**:
   - Convierte los tokens de Figma en variables CSS
   - Organiza las variables por categorías

### 3. Integración con Storybook

1. **Instala el addon de Storybook para Figma**:

   ```bash
   npm install --save-dev @storybook/addon-designs
   ```

2. **Configura el addon en `.storybook/main.ts`**:

   ```typescript
   import type { StorybookConfig } from '@storybook/react-webpack5';

   const config: StorybookConfig = {
     // ...
     addons: [
       // ...
       '@storybook/addon-designs',
     ],
     // ...
   };
   ```

3. **Vincula tus componentes con los diseños de Figma**:
   ```typescript
   export const Primary: Story = {
     args: {
       // ...
     },
     parameters: {
       design: {
         type: 'figma',
         url: 'https://www.figma.com/file/YOUR_FIGMA_FILE_URL/Design-System?node-id=10%3A15',
       },
     },
   };
   ```

### 4. Uso de tokens en componentes

1. **Importa las variables CSS**:

   ```css
   @import '../../tokens/dist/variables.css';
   ```

2. **Usa las variables en tus estilos**:
   ```css
   .button {
     background-color: var(--button-primary-background);
     color: var(--button-primary-text);
     padding: var(--button-medium-padding);
     font-size: var(--button-medium-font-size);
     border-radius: var(--button-medium-border-radius);
   }
   ```

## Flujo de trabajo recomendado

1. **Diseñadores**: Definen tokens en Figma usando el plugin Figma Tokens
2. **Diseñadores**: Exportan tokens como JSON
3. **Desarrolladores**: Transforman tokens JSON en variables CSS/JS
4. **Desarrolladores**: Implementan componentes usando las variables
5. **Desarrolladores**: Vinculan componentes en Storybook con sus diseños en Figma
6. **Equipo**: Revisa componentes en Storybook, comparando con el diseño original

## Herramientas adicionales

- **Figma Tokens Plugin**: https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens
- **Style Dictionary**: https://amzn.github.io/style-dictionary/
- **Storybook Addon Designs**: https://storybook.js.org/addons/@storybook/addon-designs
- **Figma API**: https://www.figma.com/developers/api

## Automatización

Para proyectos más grandes, considera:

1. **Configurar un webhook de Figma** para notificar cambios
2. **Crear un script de CI/CD** que:
   - Descargue los tokens actualizados de Figma
   - Transforme los tokens
   - Actualice la documentación
   - Ejecute pruebas visuales de regresión

Esto garantiza que tu implementación siempre esté sincronizada con el diseño.
