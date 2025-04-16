import { Canvas } from './components/Canvas.js';
import { Toolbar } from './components/Toolbar.js';

class PaintApp {
    constructor() {
        this.canvas = new Canvas(document.getElementById('drawing-canvas'));
        this.toolbar = new Toolbar(this.canvas);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaintApp();
}); 