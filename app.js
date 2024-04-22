		//getting the canvas and context for drawing
		const canvas = document.getElementById('canvas');
		const context = canvas.getContext('2d');
		//getting the buttns and range input for brush settings
		const colorPickerButton = document.getElementById('colorPickerButton');
		const colorPicker = document.getElementById('colorPicker');
		const eraserButton = document.getElementById('eraserButton');
		const mixButton = document.getElementById('mixButton');
		const brushSizeButton = document.getElementById('brushSizeButton');
		const brushSize = document.getElementById('brushSize');
		//getting the buttons for selecting brush shape
		const saveButton = document.getElementById('saveButton');
		const downloadLink = document.getElementById('downloadLink');
		const squareBrushButton = document.getElementById('squareBrushButton');
		const roundBrushButton = document.getElementById('roundBrushButton');
		//tracking brush states
		let isDrawing = false;
		let previousPoint = null;
		let eraserEnabled = false;
		let mixEnabled = false;
		let brushSizeValue = 10;
		let brushShape = 'round';
		context.lineCap = 'round';

		function generateRandomColor() {
		    return '#' + Math.floor(Math.random() * 16777215).toString(16);
		}
		//getting elements for uploading image
		const imageInput = document.getElementById('imageInput');
		const uploadButton = document.getElementById('uploadButton');
		const fixedCanvasSize = 800;
		//function for centering image on canvas
		function centerImage(img) {
		    const canvasWidth = fixedCanvasSize;
		    const canvasHeight = fixedCanvasSize;
		    const imgRatio = img.width / img.height;
		    const canvasRatio = canvasWidth / canvasHeight;
		    let newWidth = canvasWidth;
		    let newHeight = canvasHeight;
		    if (imgRatio > canvasRatio) {
		        newHeight = canvasWidth / imgRatio;
		    } else {
		        newWidth = canvasHeight * imgRatio;
		    }
		    context.drawImage(img, (canvasWidth - newWidth) / 2, (canvasHeight - newHeight) / 2, newWidth, newHeight);
		}
		//event handler for "draw image pixels" button
		const drawImagePixelsButton = document.getElementById('drawImagePixelsButton');
		drawImagePixelsButton.addEventListener('click', () => {
		    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
		    for (let y = 0; y < canvas.height; y += 5) {
		        for (let x = 0; x < canvas.width; x += 5) {
		            const index = (x + y * imgData.width) * 4;
		            const red = imgData.data[index];
		            const green = imgData.data[index + 1];
		            const blue = imgData.data[index + 2];
		            context.beginPath();
		            context.arc(x, y, 2, 0, 2 * Math.PI);
		            context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
		            context.fill();
		        }
		    }
		});
		//event handler for "draw circles from Image pixels" button
		const drawCirclesButton = document.getElementById('drawCirclesButton');
		drawCirclesButton.addEventListener('click', () => {
		    const img = new Image();
		    img.onload = () => {
		        canvas.width = fixedCanvasSize;
		        canvas.height = fixedCanvasSize;
		        context.drawImage(img, 0, 0, fixedCanvasSize, fixedCanvasSize);
		        const imageData = context.getImageData(0, 0, fixedCanvasSize, fixedCanvasSize);
		        const data = imageData.data;
		        const circleRadius = 10;
		        for (let y = 0; y < fixedCanvasSize; y += circleRadius * 2) {
		            for (let x = 0; x < fixedCanvasSize; x += circleRadius * 2) {
		                const red = data[(y * fixedCanvasSize + x) * 4];
		                const green = data[(y * fixedCanvasSize + x) * 4 + 1];
		                const blue = data[(y * fixedCanvasSize + x) * 4 + 2];
		                context.beginPath();
		                context.arc(x, y, circleRadius, 0, Math.PI * 2, false);
		                context.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
		                context.fill();
		            }
		        }
		    };
		    img.src = canvas.toDataURL();
		});
		//uploading image
		uploadButton.addEventListener('click', () => {
		    imageInput.click();
		});

		imageInput.addEventListener('change', () => {
		    const file = imageInput.files[0];
		    const reader = new FileReader();
		    reader.onload = (event) => {
		        const img = new Image();
		        img.onload = () => {
		            canvas.width = fixedCanvasSize;
		            canvas.height = fixedCanvasSize;
		            centerImage(img);
		        };
		        img.src = event.target.result;
		    };
		    reader.readAsDataURL(file);
		});

		const randomColor = generateRandomColor();
		document.documentElement.style.setProperty('--random-button-color', randomColor);

		colorPickerButton.addEventListener('click', () => {
		    if (eraserEnabled) {
		        eraserEnabled = false;
		        colorPickerButton.style.backgroundColor = '#4CAF50';
		    }
		    colorPickerButton.style.backgroundColor = randomColor;
		});

		eraserButton.addEventListener('click', () => {
		    eraserEnabled = !eraserEnabled;
		    if (eraserEnabled) {
		        context.strokeStyle = 'white';
		        eraserButton.style.backgroundColor = '#f44336';
		    } else {
		        context.strokeStyle = colorPicker.value;
		        eraserButton.style.backgroundColor = '#4CAF50';
		    }
		});

		mixButton.addEventListener('click', () => {
		    if (mixEnabled) {
		        mixEnabled = false;
		        mixButton.style.backgroundColor = '#4CAF50';
		    } else {
		        mixEnabled = true;
		        mixButton.style.backgroundColor = '#f44336';
		    }
		    brushShape = mixEnabled ? 'mix' : 'round';
		});

		brushSizeButton.addEventListener('click', () => {
		    if (brushSize.style.display === 'none') {
		        brushSize.style.display = 'block';
		    } else {
		        brushSize.style.display = 'none';
		    }
		});

		brushSize.addEventListener('input', () => {
		    brushSizeValue = brushSize.value;
		    context.lineWidth = brushSizeValue;
		});

		squareBrushButton.addEventListener('click', () => {
		    brushShape = 'square';
		    squareBrushButton.classList.add('selected');
		    roundBrushButton.classList.remove('selected');
		});

		roundBrushButton.addEventListener('click', () => {
		    brushShape = 'round';
		    roundBrushButton.classList.add('selected');
		    squareBrushButton.classList.remove('selected');
		});

		saveButton.addEventListener('click', () => {
		    downloadLink.href = canvas.toDataURL('image/png');
		    downloadLink.click();
		});
		//getting the position of the canvas on the page
		const canvasPosition = canvas.getBoundingClientRect();
		//event handlers for drawing on the canvas
		canvas.addEventListener('mousedown', (event) => {
		    if (brushShape === 'square') {
		        context.lineCap = 'butt';
		    } else {
		        context.lineCap = 'round';
		    }

		    if (brushShape === 'mix') {
		        context.globalCompositeOperation = 'lighter';
		    } else {
		        context.globalCompositeOperation = 'source-over';
		    }

		    isDrawing = true;
		    context.beginPath();
		    context.moveTo(event.clientX - canvasPosition.left, event.clientY - canvasPosition.top);
		    context.lineWidth = brushSizeValue;

		    if (eraserEnabled) {
		        context.strokeStyle = 'white';
		    } else {
		        context.strokeStyle = colorPicker.value;
		    }

		    previousPoint = {
		        x: event.clientX - canvasPosition.left,
		        y: event.clientY - canvasPosition.top
		    };
		});

		canvas.addEventListener('mousemove', (event) => {
		    if (isDrawing) {
		        context.beginPath();
		        context.moveTo(previousPoint.x, previousPoint.y);
		        context.lineTo(event.clientX - canvasPosition.left, event.clientY - canvasPosition.top);
		        context.stroke();
		        previousPoint = {
		            x: event.clientX - canvasPosition.left,
		            y: event.clientY - canvasPosition.top
		        };
		    }
		});

		canvas.addEventListener('mouseup', () => {
		    isDrawing = false;
		});

		canvas.addEventListener('mousedown', (event) => {
		    if (brushShape === 'square') {
		        context.lineCap = 'butt';
		    } else {
		        context.lineCap = 'round';
		    }
		});

		canvas.addEventListener('mousedown', (event) => {
		    if (mixEnabled) {
		        context.globalCompositeOperation = 'multiply';
		    } else {
		        context.globalCompositeOperation = 'source-over';
		    }
		});
		/////-----------------------------------------------\\\\\