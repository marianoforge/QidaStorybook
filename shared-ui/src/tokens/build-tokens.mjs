import * as StyleDictionaryModule from 'style-dictionary';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo de tokens
const tokensPath = path.resolve(__dirname, 'figma-tokens.json');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');
const tokens = JSON.parse(tokensContent);

// Función para generar CSS variables
function generateCSSVariables(tokens) {
  let css = `/**
 * Do not edit directly
 * Generated from design tokens
 */

:root {\n`;

  // Función recursiva para procesar tokens
  function processTokens(obj, prefix = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}-${key}` : key;

      if (obj[key].value !== undefined) {
        // Es un token con valor
        css += `  --${fullKey}: ${obj[key].value};\n`;
      } else if (typeof obj[key] === 'object') {
        // Verificar si es un objeto de sombra
        if (key === 'shadow1' || key === 'shadow2') {
          // Procesar objeto de sombra
          const shadow = obj[key];
          if (
            shadow.x !== undefined &&
            shadow.y !== undefined &&
            shadow.blur !== undefined &&
            shadow.spread !== undefined &&
            shadow.color !== undefined
          ) {
            const shadowValue = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
            css += `  --${fullKey}: ${shadowValue};\n`;
          }
        } else {
          // Es un grupo de tokens normal
          processTokens(obj[key], fullKey);
        }
      }
    }
  }

  // Procesar tokens globales
  if (tokens.global) {
    for (const category in tokens.global) {
      processTokens(tokens.global[category], category);
    }
  }

  // Procesar tokens de componentes
  if (tokens.components) {
    for (const component in tokens.components) {
      for (const variant in tokens.components[component]) {
        if (
          typeof tokens.components[component][variant] === 'object' &&
          variant !== 'sizes'
        ) {
          for (const state in tokens.components[component][variant]) {
            const value = tokens.components[component][variant][state].value;
            if (value) {
              // Reemplazar referencias a otros tokens
              let finalValue = value;
              if (value.startsWith('{') && value.endsWith('}')) {
                const reference = value
                  .substring(1, value.length - 1)
                  .replace(/\./g, '-');
                finalValue = `var(--${reference})`;
              }
              css += `  --${component}-${variant}-${state}: ${finalValue};\n`;
            }
          }
        } else if (variant === 'sizes') {
          for (const size in tokens.components[component][variant]) {
            for (const prop in tokens.components[component][variant][size]) {
              const value =
                tokens.components[component][variant][size][prop].value;
              if (value) {
                // Reemplazar referencias a otros tokens
                let finalValue = value;
                if (value.includes('{') && value.includes('}')) {
                  // Manejar múltiples referencias en un valor (como en padding)
                  finalValue = value.replace(/\{([^}]+)\}/g, (match, p1) => {
                    return `var(--${p1.replace(/\./g, '-')})`;
                  });
                }
                css += `  --${component}-${size}-${prop}: ${finalValue};\n`;
              }
            }
          }
        }
      }
    }
  }

  css += '}\n';
  return css;
}

// Función para generar tokens JavaScript
function generateJSTokens(tokens) {
  const jsTokens = {};

  // Función recursiva para procesar tokens
  function processTokens(obj, target, prefix = '') {
    for (const key in obj) {
      if (obj[key].value !== undefined) {
        // Es un token con valor
        const tokenKey = prefix
          ? `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`
          : key;
        target[tokenKey] = obj[key].value;
      } else if (typeof obj[key] === 'object') {
        // Verificar si es un objeto de sombra
        if (key === 'shadow1' || key === 'shadow2') {
          // Procesar objeto de sombra
          const shadow = obj[key];
          if (
            shadow.x !== undefined &&
            shadow.y !== undefined &&
            shadow.blur !== undefined &&
            shadow.spread !== undefined &&
            shadow.color !== undefined
          ) {
            if (!target[key]) {
              target[key] = {};
            }
            target[key].x = shadow.x;
            target[key].y = shadow.y;
            target[key].blur = shadow.blur;
            target[key].spread = shadow.spread;
            target[key].color = shadow.color;

            // Agregar también la versión CSS
            target[
              key
            ].value = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
          }
        } else {
          // Es un grupo de tokens normal
          const newPrefix = prefix
            ? `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`
            : key;
          if (!target[key]) {
            target[key] = {};
          }
          processTokens(
            obj[key],
            target[key],
            newPrefix === key ? '' : newPrefix
          );
        }
      }
    }
  }

  // Procesar tokens globales
  if (tokens.global) {
    jsTokens.global = {};
    for (const category in tokens.global) {
      jsTokens.global[category] = {};
      processTokens(tokens.global[category], jsTokens.global[category]);
    }
  }

  // Procesar tokens de componentes
  if (tokens.components) {
    jsTokens.components = {};
    for (const component in tokens.components) {
      jsTokens.components[component] = {};
      for (const variant in tokens.components[component]) {
        if (variant !== 'sizes') {
          jsTokens.components[component][variant] = {};
          for (const state in tokens.components[component][variant]) {
            const value = tokens.components[component][variant][state].value;
            if (value) {
              jsTokens.components[component][variant][state] = value;
            }
          }
        } else {
          jsTokens.components[component].sizes = {};
          for (const size in tokens.components[component][variant]) {
            jsTokens.components[component].sizes[size] = {};
            for (const prop in tokens.components[component][variant][size]) {
              const value =
                tokens.components[component][variant][size][prop].value;
              if (value) {
                jsTokens.components[component].sizes[size][prop] = value;
              }
            }
          }
        }
      }
    }
  }

  return `/**
 * Do not edit directly
 * Generated from design tokens
 */

export const tokens = ${JSON.stringify(jsTokens, null, 2)};
`;
}

// Generar CSS y JS
const cssOutput = generateCSSVariables(tokens);
const jsOutput = generateJSTokens(tokens);

// Asegurarse de que el directorio dist exista
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Escribir los archivos
fs.writeFileSync(path.resolve(distDir, 'variables.css'), cssOutput);
fs.writeFileSync(path.resolve(distDir, 'tokens.js'), jsOutput);

console.log('✅ Tokens generados correctamente en:');
console.log('  - shared-ui/src/tokens/dist/variables.css');
console.log('  - shared-ui/src/tokens/dist/tokens.js');
