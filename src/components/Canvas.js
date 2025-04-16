export class Canvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pencil';
        this.startX = 0;
        this.startY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupEventListeners();
        this.resizeCanvas();
        this.fillWhite();
        this.startCursorAnimation();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.fillWhite();
        });
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
            this.mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
            this.draw(e);
        });
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    startCursorAnimation() {
        let lastSize = this.ctx.lineWidth;
        const animate = () => {
            if (this.currentTool === 'eraser') {
                // Check if size changed
                if (lastSize !== this.ctx.lineWidth) {
                    // Clear the old cursor
                    this.ctx.save();
                    this.ctx.clearRect(
                        this.mouseX - lastSize/2 - 1,
                        this.mouseY - lastSize/2 - 1,
                        lastSize + 2,
                        lastSize + 2
                    );
                    this.ctx.restore();
                    lastSize = this.ctx.lineWidth;
                }

                // Save the current canvas state
                this.ctx.save();
                
                // Create a temporary canvas to store the current state
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.canvas.width;
                tempCanvas.height = this.canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(this.canvas, 0, 0);
                
                // Clear only the cursor area
                const size = this.ctx.lineWidth;
                this.ctx.clearRect(
                    this.mouseX - size/2 - 1,
                    this.mouseY - size/2 - 1,
                    size + 2,
                    size + 2
                );
                
                // Draw the cursor
                this.ctx.beginPath();
                this.ctx.arc(this.mouseX, this.mouseY, size/2, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Restore the canvas state
                this.ctx.restore();
                
                // Only restore the original content if we're not currently erasing
                if (!this.isDrawing) {
                    requestAnimationFrame(() => {
                        this.ctx.drawImage(tempCanvas, 0, 0);
                    });
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 50;
    }

    fillWhite() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setTool(tool) {
        this.currentTool = tool;
        // Reset to default drawing mode
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.currentColor;
    }

    setColor(color) {
        this.ctx.strokeStyle = color;
    }

    setLineWidth(width) {
        this.ctx.lineWidth = width;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        
        if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (this.currentTool === 'pencil') {
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'eraser') {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.restore();
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    stopDrawing() {
        this.isDrawing = false;
        if (this.currentTool === 'pencil' || this.currentTool === 'eraser') {
            this.ctx.closePath();
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.fillWhite();
    }

    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }

    loadImage(dataURL) {
        const img = new Image();
        img.onload = () => {
            this.clear();
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = dataURL;
    }

    handleLineWidthChange(e) {
        const size = parseInt(e.target.value);
        this.ctx.lineWidth = size;
        this.currentLineWidth = size;
        
        // Force a redraw of the cursor when size changes
        if (this.currentTool === 'eraser') {
            this.ctx.save();
            const size = this.ctx.lineWidth;
            this.ctx.clearRect(
                this.mouseX - size/2 - 1,
                this.mouseY - size/2 - 1,
                size + 2,
                size + 2
            );
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, size/2, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
} 