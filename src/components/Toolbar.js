export class Toolbar {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupToolButtons();
        this.setupColorPicker();
        this.setupColorSwatches();
        this.setupSizeSlider();
        this.setupFileButtons();
    }

    setupToolButtons() {
        document.querySelectorAll('.tool-button').forEach(button => {
            if (button.id !== 'save' && button.id !== 'load') {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.canvas.setTool(button.id);
                });
            }
        });
    }

    setupColorPicker() {
        const colorPicker = document.getElementById('color-picker');
        colorPicker.addEventListener('input', (e) => {
            this.setColor(e.target.value);
        });
        // Set initial color
        this.setColor(colorPicker.value);
    }

    setupColorSwatches() {
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.getAttribute('data-color');
                this.setColor(color);
                // Update color picker
                document.getElementById('color-picker').value = color;
                // Update active swatch
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
        });
        // Set initial active swatch (black)
        document.querySelector('.color-swatch[data-color="#000000"]').classList.add('active');
    }

    setColor(color) {
        this.canvas.setColor(color);
        // Update active swatch if it exists in the palette
        const matchingSwatch = document.querySelector(`.color-swatch[data-color="${color.toUpperCase()}"]`);
        if (matchingSwatch) {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            matchingSwatch.classList.add('active');
        }
    }

    setupSizeSlider() {
        const sizeSlider = document.getElementById('size-slider');
        sizeSlider.addEventListener('input', (e) => {
            this.canvas.setLineWidth(e.target.value);
        });
        // Set initial line width
        this.canvas.setLineWidth(sizeSlider.value);
    }

    setupFileButtons() {
        document.getElementById('save').addEventListener('click', async () => {
            const dataURL = this.canvas.getDataURL();
            const result = await window.electronAPI.saveDrawing(dataURL);
            if (result.success) {
                alert(`Drawing saved to ${result.path}`);
            }
        });

        document.getElementById('load').addEventListener('click', async () => {
            const result = await window.electronAPI.loadDrawing();
            if (result.success) {
                this.canvas.loadImage(result.data);
            }
        });
    }
} 