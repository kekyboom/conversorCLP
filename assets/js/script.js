const apiURL = "https://mindicador.cl/api";

const clpAmount = document.getElementById("clp-amount");
const currencySelect = document.getElementById("currency-select");
const convertButton = document.getElementById("convert-button");
const result = document.getElementById("result");
const chartDOM = document.getElementById("currency-chart");

let chart;

//Función para obtener currency
async function getCurrency() {
        
    try {
        const res = await fetch(apiURL);
        const currencyData = await res.json();      
        return currencyData;

} catch (e) {
    alert(e.message);
    }
}

//preparar Chart

function prepareChartConfig(data) {
    const slicedData = data.serie.slice(0, 10).reverse();
    
    const labels = slicedData.map (item => {
        const date = new Date(item.fecha);
        return date.toLocaleDateString("es-CL");
    }); 
    const values = slicedData.map(item => Number(item.valor));
    
   return {
        type: 'line',
        data: {
            labels: labels,  
            datasets: [{
                label: 'Valor de la moneda',
                backgroundColor: '#F56C0B', 
                borderColor: '#F56C0B',
                data: values,
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };
}
async function renderChart(currencyType) {
    const history = await getCurrencyHistory(currencyType);
    const config = prepareChartConfig(history);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(chartDOM, config);
}

async function getCurrencyHistory(currencyType) {
    const resCurrency = await fetch(`https://mindicador.cl/api/${currencyType}`);
    const data = await resCurrency.json();
    return data; 
}

async function currencyConvertion() {
    
    const amount = parseFloat(clpAmount.value);

    if (isNaN(amount) || amount <= 0) {
        result.innerText = "Ingrese un valor valido en CLP.";
        return;
    }

    const currency = await getCurrency();

    if (currencySelect.value === "usd") {
        const convertedAmount = amount / currency.dolar.valor;
        result.innerHTML = `<p>Resultado: $${convertedAmount.toFixed(2)}</p>`
        await renderChart("dolar"); 
    } else if (currencySelect.value === "eur") {
        const convertedAmount = amount / currency.euro.valor;
        result.innerHTML = `Resultado: €${convertedAmount.toFixed(2)}`
        chartDOM.innerText = `${"Ingrese un valor valido en CLP."}`;
        await renderChart("euro");
    } else {
        result.innerText = "Seleccione la moneda a convertir.";
    }
}

convertButton.addEventListener("click", currencyConvertion); 
