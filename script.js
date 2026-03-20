// --- Calculator Functions ---
const display = document.getElementById('display');

function appendToDisplay(input) { display.value += input; }
function clearDisplay() { display.value = ""; }
function deleteLast() { display.value = display.value.slice(0, -1); }

function calculate() {
    try {
        let expression = display.value.replace(/π/g, Math.PI).replace(/%/g, '/100');
        display.value = eval(expression);
    } catch (e) { display.value = "Error"; }
}

function sciFunc(type) {
    let val = parseFloat(display.value);
    if (isNaN(val)) return;
    switch(type) {
        case 'sin': display.value = Math.sin(val * Math.PI / 180).toFixed(4); break;
        case 'cos': display.value = Math.cos(val * Math.PI / 180).toFixed(4); break;
        case 'tan': display.value = Math.tan(val * Math.PI / 180).toFixed(4); break;
        case 'log': display.value = Math.log10(val).toFixed(4); break;
        case 'sqrt': display.value = Math.sqrt(val).toFixed(4); break;
        case 'pow': display.value = Math.pow(val, 2); break;
        case 'exp': display.value = Math.exp(val).toFixed(4); break;
    }
}

// --- Multi-Converter Logic ---
const decInp = document.getElementById('decimalInput');
const binInp = document.getElementById('binaryInput');
const hexInp = document.getElementById('hexInput');

function convertFromDecimal() {
    let val = parseInt(decInp.value);
    if (!isNaN(val)) {
        binInp.value = val.toString(2);
        hexInp.value = val.toString(16).toUpperCase();
    } else { clearConverter(); }
}

function convertFromBinary() {
    let val = binInp.value;
    if (/^[01]+$/.test(val)) {
        let decimal = parseInt(val, 2);
        decInp.value = decimal;
        hexInp.value = decimal.toString(16).toUpperCase();
    } else if (val === "") { clearConverter(); }
}

function convertFromHex() {
    let val = hexInp.value;
    if (/^[0-9A-Fa-f]+$/.test(val)) {
        let decimal = parseInt(val, 16);
        decInp.value = decimal;
        binInp.value = decimal.toString(2);
    } else if (val === "") { clearConverter(); }
}

function clearConverter() {
    decInp.value = "";
    binInp.value = "";
    hexInp.value = "";
}

// --- Graph Logic (Aluth Kotasa) ---

let myChart = null; // Graph object එක store කරන්න

function plotGraph() {
    const equationStr = document.getElementById('equationInput').value;
    const ctx = document.getElementById('myChart').getContext('2d');
    const xValues = [];
    const yValues = [];

    // ප්‍රස්තාරය ඇඳීමට අවශ්‍ය x අගයන් පරාසය (උදා: -10 සිට 10 දක්වා)
    for (let x = -10; x <= 10; x += 0.5) {
        xValues.push(x);
        
        try {
            // "y =" කොටසක් තිබුණොත් අයින් කිරීම
            let expression = equationStr.replace("y =", "").trim();
            
            // Equation එක ඇතුළේ තියෙන x අකුර actual x අගයට replace කිරීම
            let evaluatedExpr = expression.replace(/x/g, `(${x})`);
            
            // eval() මගින් y අගය ගණනය කිරීම
            let y = eval(evaluatedExpr);
            
            // Invalid අගයන් check කිරීම (Error වැළැක්වීමට)
            if (isNaN(y) || !isFinite(y)) {
                yValues.push(null); // Chart.js null values අඳින්නේ නැහැ
            } else {
                yValues.push(y);
            }
        } catch (error) {
            yValues.push(null);
        }
    }

    // කලින් Graph එකක් තිබුණා නම් ඒක අයින් කිරීම (refresh)
    if (myChart) {
        myChart.destroy();
    }

    // Chart.js මගින් Graph එක ඇඳීම
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: `y = ${equationStr}`,
                data: yValues,
                borderColor: '#818cf8',
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: '#818cf8',
                pointHoverRadius: 5,
                spanGaps: true // Null values මග හැර line එක ඇඳීම
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Canvas height එක CSS වලින් පාලනය කිරීමට
            scales: {
                x: {
                    type: 'linear', // Linear scale එකක් (සංඛ්‍යා පේළියක්)
                    title: { display: true, text: 'x-axis', color: '#94a3b8' },
                    ticks: { color: '#f8fafc' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    title: { display: true, text: 'y-axis', color: '#94a3b8' },
                    ticks: { color: '#f8fafc' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });
}