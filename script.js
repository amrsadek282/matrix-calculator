// Matrix Rain Effect
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');
const fallbackBg = document.querySelector('.fallback-bg');

// Check if canvas is supported
if (!ctx) {
    fallbackBg.classList.remove('hidden');
    canvas.style.display = 'none';
} else {
    // Set canvas dimensions to cover the entire document height
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight; // Use the full document height
        fallbackBg.style.height = document.body.scrollHeight + 'px'; // Match fallback height
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas); // Update on window resize

    const chars = '0123456789';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize / 2); // Reduced columns for better performance
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';
        const isLightMode = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLightMode ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 212, 255, 0.5)';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize * 2, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 70); // Slower animation for better performance
}

// Show welcome modal
window.onload = () => {
    console.log("Page loaded, showing welcome modal...");
    document.getElementById('welcomeModal').style.display = 'flex';
    updateMatrixInputs();
};

// Close modal
function closeModal() {
    console.log("Closing modal...");
    document.getElementById('welcomeModal').style.display = 'none';
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    console.log("Toggling theme...");
    document.body.classList.toggle('light-mode');
});

// Update matrix inputs
function updateMatrixInputs() {
    console.log("Updating matrix inputs...");
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);

    // Update Matrix A
    const matrixA = document.getElementById('matrixA');
    matrixA.style.gridTemplateColumns = `repeat(${colsA}, minmax(0, 1fr))`;
    matrixA.innerHTML = '';
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            matrixA.innerHTML += `<input type="number" id="a_${i}_${j}" value="0" class="input-field">`;
        }
    }

    // Update Matrix B
    const matrixB = document.getElementById('matrixB');
    matrixB.style.gridTemplateColumns = `repeat(${colsB}, minmax(0, 1fr))`;
    matrixB.innerHTML = '';
    for (let i = 0; i < rowsB; i++) {
        for (let j = 0; j < colsB; j++) {
            matrixB.innerHTML += `<input type="number" id="b_${i}_${j}" value="0" class="input-field">`;
        }
    }
}

// Event listeners for size inputs
document.getElementById('rowsA').addEventListener('change', updateMatrixInputs);
document.getElementById('colsA').addEventListener('change', updateMatrixInputs);
document.getElementById('rowsB').addEventListener('change', updateMatrixInputs);
document.getElementById('colsB').addEventListener('change', updateMatrixInputs);

// Get Matrix A
function getMatrixA() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const matrix = [];
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsA; j++) {
            row.push(parseFloat(document.getElementById(`a_${i}_${j}`).value) || 0);
        }
        matrix.push(row);
    }
    return matrix;
}

// Get Matrix B
function getMatrixB() {
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    const matrix = [];
    for (let i = 0; i < rowsB; i++) {
        const row = [];
        for (let j = 0; j < colsB; j++) {
            row.push(parseFloat(document.getElementById(`b_${i}_${j}`).value) || 0);
        }
        matrix.push(row);
    }
    return matrix;
}

// Show toast notification
let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Display result
function displayResult(matrix) {
    console.log("Displaying result...", matrix);
    const resultDiv = document.getElementById('result');
    const resultMatrix = document.getElementById('resultMatrix');
    resultMatrix.style.gridTemplateColumns = `repeat(${matrix[0].length}, minmax(0, 1fr))`;
    resultMatrix.innerHTML = '';
    matrix.forEach(row => {
        row.forEach(val => {
            resultMatrix.innerHTML += `<input type="text" value="${val.toFixed(2)}" class="input-field text-center" readonly>`;
        });
    });
    resultDiv.classList.remove('hidden');
}

// Export result
function exportResult() {
    console.log("Exporting result...");
    const resultMatrix = document.getElementById('resultMatrix');
    const inputs = resultMatrix.querySelectorAll('input');
    let text = '';
    let cols = parseInt(resultMatrix.style.gridTemplateColumns.match(/\d+/)[0]);
    let row = [];
    inputs.forEach((input, index) => {
        row.push(input.value);
        if ((index + 1) % cols === 0) {
            text += row.join('\t') + '\n';
            row = [];
        }
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'matrix_result.txt';
    link.click();
    showToast('Result exported successfully!', 'success');
}

// Copy result to clipboard
function copyResult() {
    console.log("Copying result...");
    const resultMatrix = document.getElementById('resultMatrix');
    const inputs = resultMatrix.querySelectorAll('input');
    let text = '';
    let cols = parseInt(resultMatrix.style.gridTemplateColumns.match(/\d+/)[0]);
    let row = [];
    inputs.forEach((input, index) => {
        row.push(input.value);
        if ((index + 1) % cols === 0) {
            text += row.join('\t') + '\n';
            row = [];
        }
    });
    navigator.clipboard.writeText(text).then(() => {
        showToast('Result copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy result: ' + err.message, 'error');
    });
}

// Clear all inputs
function clearAll() {
    console.log("Clearing all inputs...");
    document.getElementById('rowsA').value = 2;
    document.getElementById('colsA').value = 2;
    document.getElementById('rowsB').value = 2;
    document.getElementById('colsB').value = 2;
    document.getElementById('operation').value = 'sum';
    document.getElementById('result').classList.add('hidden');
    updateMatrixInputs();
    showToast('Inputs cleared!', 'success');
}

// Calculate
function calculate() {
    try {
        console.log("Starting calculation...");
        const calcButton = document.querySelector('#calcText');
        const calcLoader = document.querySelector('#calcLoader');
        calcButton.textContent = 'Calculating...';
        calcLoader.classList.remove('hidden');

        setTimeout(() => {
            const operation = document.getElementById('operation').value;
            const matrixA = getMatrixA();
            const matrixB = getMatrixB();
            let result;

            if (operation === 'sum') {
                if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                    throw new Error('Matrices must have the same dimensions for sum.');
                }
                result = math.add(matrixA, matrixB);
            } else if (operation === 'minus') {
                if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                    throw new Error('Matrices must have the same dimensions for subtraction.');
                }
                result = math.subtract(matrixA, matrixB);
            } else if (operation === 'transpose') {
                result = math.transpose(matrixA);
            } else if (operation === 'multiply') {
                if (matrixA[0].length !== matrixB.length) {
                    throw new Error('Number of columns in Matrix A must equal number of rows in Matrix B for multiplication.');
                }
                result = math.multiply(matrixA, matrixB);
            } else if (operation === 'inverse') {
                if (matrixA.length !== matrixA[0].length) {
                    throw new Error('Matrix A must be square for inverse.');
                }
                result = math.inv(matrixA);
            }

            calcButton.textContent = 'Calculate';
            calcLoader.classList.add('hidden');
            displayResult(result);
            showToast('Calculation completed!', 'success');
        }, 500);
    } catch (error) {
        const calcButton = document.querySelector('#calcText');
        const calcLoader = document.querySelector('#calcLoader');
        calcButton.textContent = 'Calculate';
        calcLoader.classList.add('hidden');
        showToast('Error: ' + error.message, 'error');
        console.error("Calculation error:", error.message);
    }
}