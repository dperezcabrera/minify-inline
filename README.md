# Minify and Inline HTML Script

## Descripción

Este script de Node.js combina y minifica archivos CSS y JavaScript que se encuentran en un archivo HTML dado. Luego, incrusta el contenido minificado directamente en el archivo HTML y lo guarda con un nuevo nombre, utilizando la extensión `.bundle.html`.

## Requisitos

- Node.js v14 o superior
- Dependencias de npm:
  - `esbuild`
  - `html-minifier-terser`

## Instalación

### Instalación Local

1. Clona este repositorio o descarga el script `minifyAndInline.js`.
2. Instala las dependencias necesarias ejecutando el siguiente comando en el directorio donde se encuentra el script:

    ```bash
    npm install esbuild html-minifier-terser
    ```

3. Para minificar e incrustar los archivos CSS y JS de un archivo HTML, ejecuta el script proporcionando la ruta al archivo HTML como parámetro:

    ```bash
    node minifyAndInline.js ruta/del/archivo.html
    ```

### Instalación Global como Herramienta CLI

Si deseas usar este script como una herramienta de línea de comandos desde cualquier lugar en tu terminal:

1. Añade la siguiente línea al principio del archivo `minifyAndInline.js` para hacer que el script sea ejecutable:

    ```javascript
    #!/usr/bin/env node
    ```

2. Actualiza el archivo `package.json` para incluir la configuración `bin`:

    ```json
    {
      "name": "minify-inline-tool",
      "version": "1.0.0",
      "description": "Herramienta para minificar e incrustar CSS y JS en HTML.",
      "main": "minifyAndInline.js",
      "bin": {
        "minify-inline": "./minifyAndInline.js"
      },
      "dependencies": {
        "esbuild": "^0.14.0",
        "html-minifier-terser": "^7.0.0"
      },
      "author": "Tu Nombre",
      "license": "MIT"
    }
    ```

3. Instala la herramienta globalmente:

    ```bash
    npm install -g .
    ```

4. Ahora, puedes usar el comando `minify-inline` desde cualquier lugar en tu terminal para minificar e incrustar archivos:

    ```bash
    minify-inline ruta/del/archivo.html
    ```

    Esto generará un nuevo archivo con el mismo nombre pero con la extensión `.bundle.html` en el mismo directorio que el archivo original.

## Personalización

Puedes ajustar las opciones de minificación modificando los parámetros en la función `minify` en el script `minifyAndInline.js`. Las opciones disponibles incluyen:

- `collapseWhitespace`: Elimina los espacios en blanco innecesarios.
- `removeComments`: Elimina los comentarios del HTML.
- `minifyCSS`: Minifica el CSS embebido.
- `minifyJS`: Minifica el JavaScript embebido.

## Contribución

Si encuentras algún problema o tienes sugerencias para mejorar el script, siéntete libre de abrir un issue o enviar un pull request.

## Licencia

Este proyecto está licenciado bajo la MIT License. Consulta el archivo [LICENSE](LICENSE) para más detalles.
