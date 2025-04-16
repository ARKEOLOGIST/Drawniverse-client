# Drawniverse

A modern drawing application built with Electron, offering a smooth and intuitive drawing experience. Create your digital masterpieces with a variety of tools and colors.

## Features

- ✏️ Pencil tool with multiple colors
- 🧹 Eraser tool for precise editing
- 🎨 Color palette with 10 vibrant colors
- 📏 Adjustable brush size
- 💾 Save your artwork as PNG files
- 🖱️ Smooth drawing experience with continuous strokes

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd drawniverse
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

## Usage

### Drawing Tools

- **Pencil (✏️)**: Draw with the selected color
- **Eraser (🧹)**: Erase parts of your drawing
- **Size Slider**: Adjust the size of your brush/eraser
- **Color Palette**: Select from 10 different colors
- **Save (💾)**: Save your drawing as a PNG file

### Drawing Tips

- Click and drag to draw
- Hold the mouse button to continue drawing
- Drawing works even when moving outside the canvas
- Release the mouse button to stop drawing
- Experiment with different brush sizes for varied effects

## Development

To modify the application:

1. Edit the source files:
   - `renderer.js`: Main drawing logic
   - `styles.css`: UI styling
   - `index.html`: Application structure

2. Restart the application to see changes:
```bash
npm start
```

## License

Drawniverse is open source and available under the MIT License. 