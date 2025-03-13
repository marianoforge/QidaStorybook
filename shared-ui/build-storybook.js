const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Asegurarse de que el directorio public existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory');
}

// Crear un favicon vacío si no existe
const faviconPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  fs.writeFileSync(faviconPath, '');
  console.log('Created empty favicon.ico');
}

// Modificar temporalmente la configuración de Storybook
const mainTsPath = path.join(__dirname, '.storybook', 'main.ts');
const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');

// Hacer una copia de seguridad
fs.writeFileSync(`${mainTsPath}.backup`, mainTsContent);
console.log('Created backup of main.ts');

// Simplificar la configuración
const simplifiedConfig = `
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
};

export default config;
`;

fs.writeFileSync(mainTsPath, simplifiedConfig);
console.log('Simplified main.ts configuration');

// Crear versiones JavaScript de los archivos de historias
const storiesDir = path.join(__dirname, 'src', 'lib', 'tokens');
const storiesFile = path.join(storiesDir, 'design-tokens.stories.tsx');
const jsStoriesFile = path.join(storiesDir, 'design-tokens.stories.js');

// Leer el archivo original
const storiesContent = fs.readFileSync(storiesFile, 'utf8');

// Convertir TypeScript a JavaScript (simplificado)
const jsContent = storiesContent
  // Eliminar las interfaces
  .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
  // Eliminar las anotaciones de tipo
  .replace(/:\s*\w+(\[\])?(;|\s*=)/g, '$2')
  .replace(/:\s*\{\s*\[key:\s*string\]:\s*[^}]+\}/g, '')
  .replace(/<[^>]+>/g, '')
  .replace(/as\s+unknown\s+as[^;]+;/g, ';')
  .replace(/as\s+[^;,)]+/g, '');

// Guardar la versión JavaScript
fs.writeFileSync(jsStoriesFile, jsContent);
console.log('Created JavaScript version of stories file');

try {
  // Ejecutar el comando de construcción
  console.log('Building Storybook...');
  execSync('npx storybook build -o storybook-static', { stdio: 'inherit' });
  console.log('Storybook built successfully!');
} catch (error) {
  console.error('Error building Storybook:', error);
} finally {
  // Restaurar la configuración original
  fs.writeFileSync(mainTsPath, mainTsContent);
  console.log('Restored original main.ts configuration');

  // Eliminar el archivo JavaScript temporal
  if (fs.existsSync(jsStoriesFile)) {
    fs.unlinkSync(jsStoriesFile);
    console.log('Removed temporary JavaScript stories file');
  }
}
