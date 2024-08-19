#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const minify = require('html-minifier-terser').minify;
const CleanCSS = require('clean-css');

async function minifyAndInlineHTML(inputHtmlPath) {
    // Leer el archivo HTML
    let html = fs.readFileSync(inputHtmlPath, 'utf8');

    // Expresión regular mejorada para capturar correctamente las etiquetas <link>
    const cssRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/g;
    const jsRegex = /<script\s+src=["']([^"']+)["']\s*><\/script>/g;

    // Minificar e incrustar cada archivo CSS
    html = html.replace(cssRegex, (match, href) => {
        const cssPath = path.resolve(path.dirname(inputHtmlPath), href);
        if (path.extname(cssPath) === '.css') {
            try {
                const cssContent = fs.readFileSync(cssPath, 'utf8');
                const cssMinified = new CleanCSS({}).minify(cssContent).styles;
                return `<style>${cssMinified}</style>`;
            } catch (error) {
                console.error(`Error al procesar el archivo CSS: ${cssPath}`, error);
            }
        }
        return match; // No modificar si no es CSS
    });

    // Minificar e incrustar cada archivo JS
    html = html.replace(jsRegex, (match, src) => {
        const jsPath = path.resolve(path.dirname(inputHtmlPath), src);
        if (path.extname(jsPath) === '.js') {
            try {
                const jsMinified = esbuild.buildSync({
                    entryPoints: [jsPath],
                    bundle: true,
                    minify: true,
                    write: false
                }).outputFiles[0].text;
                return `<script>${jsMinified}</script>`;
            } catch (error) {
                console.error(`Error al procesar el archivo JS: ${jsPath}`, error);
            }
        }
        return match; // No modificar si no es JS
    });

    // Minificar el HTML resultante de manera asíncrona
    const minifiedHtml = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: false, // Ya hemos minificado el CSS manualmente
        minifyJS: false,  // Ya hemos minificado el JS manualmente
    });

    // Generar la nueva ruta con la extensión .bundle.html
    const outputHtmlPath = inputHtmlPath.replace(/\.html$/, '.bundle.html');

    // Guardar el HTML minificado en el nuevo archivo
    fs.writeFileSync(outputHtmlPath, minifiedHtml, 'utf8');
    console.log(`Archivo HTML minificado creado en: ${outputHtmlPath}`);
}

// Obtener la ruta del archivo HTML desde la línea de comandos
const inputHtmlPath = process.argv[2];
if (!inputHtmlPath) {
    console.error('Por favor, proporciona la ruta del archivo HTML como parámetro.');
    process.exit(1);
}

// Ejecutar la función
minifyAndInlineHTML(inputHtmlPath).catch(error => {
    console.error('Error al minificar e incrustar el HTML:', error);
});

