# TSPL Label Previewer

TSPL Label Previewer es una herramienta para previsualizar etiquetas diseñadas con comandos TSPL. Permite diseñar etiquetas y ver su vista previa antes de imprimir, evitando el desperdicio de etiquetas físicas. Cada comando se interpreta y se convierte en código HTML y CSS para su visualización.

## Estructura del Proyecto

### Descripción de Archivos

- **index.html**: Estructura principal de la aplicación.
- **style.css**: Estilos de la aplicación.
- **script.js**: Lógica de previsualización y manejo de eventos.
- **commands/**: Archivos que gestionan los comandos TSPL:
  - `barCodeCommand.js`
  - `barCommand.js`
  - `blockCommand.js`
  - `boxCommand.js`
  - `textCommand.js`
- **store/**: Manejo del estado y la lógica de guardado/carga de diseños:
  - `state.js`
  - `desing.js`
- **utils/**: Utilidades para:
  - Alineación (`alignmentUtils.js`)
  - Fuentes (`fontUtils.js`)
  - Transformaciones (`transformUtils.js`)

## Instalación

1. Clona el repositorio.
2. Navega al directorio del proyecto.

## Uso

1. Abre `index.html` en tu navegador.
2. Escribe tus comandos TSPL en el área de texto.
3. Selecciona la escala deseada.
4. Haz clic en **Previsualizar** para ver la etiqueta generada.
5. Utiliza los botones para guardar o cargar diseños.

## Comandos Soportados

- **SIZE**: Define el tamaño de la etiqueta.
- **CLS**: Limpia la etiqueta.
- **TEXT**: Agrega texto.
- **BARCODE**: Añade un código de barras.
- **BAR**: Inserta una barra.
- **BLOCK**: Incorpora un bloque de texto.
- **BOX**: Dibuja un cuadro.

## Futuro

Actualmente, el proyecto está implementado en JavaScript vanilla por su simplicidad. Se planea migrar a TypeScript en el futuro cercano para mejorar la mantenibilidad y escalabilidad del código.

## Contribuciones

Las contribuciones son bienvenidas. Abre un *issue* o envía un *pull request* con tus mejoras.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

¡Gracias por usar TSPL Label Previewer!
