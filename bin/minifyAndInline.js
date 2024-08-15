#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const minify = require('html-minifier-terser').minify;

async function minifyAndInlineHTML(inputHtmlPath) {
    // Leer el archivo HTML
    let html = fs.readFileSync(inputHtmlPath, 'utf8');

    // Regex para encontrar los archivos CSS y JS en el HTML
    const cssRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g;
    const jsRegex = /<script\s+src="([^"]+)"/g;

    // Minificar e incrustar cada archivo CSS
    html = html.replace(cssRegex, (match, href) => {
        const cssPath = path.resolve(path.dirname(inputHtmlPath), href);
        const cssMinified = esbuild.buildSync({
            entryPoints: [cssPath],
            bundle: true,
            minify: true,
            write: false,
        }).outputFiles[0].text;
        return `<style>${cssMinified}</style>`;
    });

    // Minificar e incrustar cada archivo JS
    html = html.replace(jsRegex, (match, src) => {
        const jsPath = path.resolve(path.dirname(inputHtmlPath), src);
        const jsMinified = esbuild.buildSync({
            entryPoints: [jsPath],
            bundle: true,
            minify: true,
            write: false,
        }).outputFiles[0].text;
        return `<script>${jsMinified}</script>`;
    });

    // Minificar el HTML resultante de manera asíncrona
    const minifiedHtml = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
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

