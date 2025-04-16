const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentTool = 'pencil';
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50; // Account for toolbar height
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Tool selection
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentTool = button.id;
    });
});

// Color selection
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        currentColor = swatch.dataset.color;
    });
});

// Save functionality
document.getElementById('save').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only draw if coordinates are within canvas bounds
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        return;
    }
    
    ctx.lineWidth = document.getElementById('size-slider').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'pencil') {
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
window.addEventListener('mousemove', draw); // Listen for mousemove on window
window.addEventListener('mouseup', stopDrawing); // Listen for mouseup on window

// Prevent right-click menu
canvas.addEventListener('contextmenu', e => e.preventDefault()); 