document.getElementById('load-stock').addEventListener('click', loadStockData);
document.getElementById('search-button').addEventListener('click', searchStockData);

function loadStockData() {
    const symbol = document.getElementById('trending-stocks').value;
    fetchStockData(symbol);
}

function searchStockData() {
    const symbol = document.getElementById('stock-search').value.toUpperCase();
    fetchStockData(symbol);
}

function fetchStockData(symbol) {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';  // Replace with your API key
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateStockInfo(symbol, data);
            updateStockChart(data);
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

function updateStockInfo(symbol, data) {
    const timeSeries = data['Time Series (Daily)'];
    const latestDay = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDay];

    document.getElementById('stock-symbol').textContent = symbol;
    document.getElementById('stock-price').textContent = latestData['4. close'];
    document.getElementById('stock-change').textContent = calculateChange(timeSeries);
    document.getElementById('stock-volume').textContent = latestData['5. volume'];
}

function updateStockChart(data) {
    const timeSeries = data['Time Series (Daily)'];
    const labels = Object.keys(timeSeries).reverse();
    const prices = labels.map(label => timeSeries[label]['4. close']);

    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

function calculateChange(timeSeries) {
    const days = Object.keys(timeSeries);
    const latestPrice = parseFloat(timeSeries[days[0]]['4. close']);
    const previousPrice = parseFloat(timeSeries[days[1]]['4. close']);
    return (latestPrice - previousPrice).toFixed(2);
}
