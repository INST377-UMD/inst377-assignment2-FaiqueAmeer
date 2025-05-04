document.addEventListener('DOMContentLoaded', function() {
    // API key for Polygon.io (you should replace this with your own key)
    const POLYGON_API_KEY = 'YOUR_POLYGON_API_KEY';
    let stockChart = null;
    
    // Fetch stock data when button is clicked
    document.getElementById('fetchStock').addEventListener('click', function() {
        const ticker = document.getElementById('stockTicker').value.trim();
        const days = document.getElementById('timeRange').value;
        
        if (!ticker) {
            alert('Please enter a stock ticker');
            return;
        }
        
        fetchStockData(ticker, days);
    });
    
    // Load top Reddit stocks
    fetchRedditStocks();
    
    function fetchStockData(ticker, days) {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(toDate.getDate() - parseInt(days));
        
        const fromDateStr = formatDate(fromDate);
        const toDateStr = formatDate(toDate);
        
        // For demo purposes, we'll use a mock response if no API key is provided
        if (POLYGON_API_KEY === 'YOUR_POLYGON_API_KEY') {
            // Use mock data for demonstration
            console.log('Using mock data - please replace with real API key');
            const mockData = generateMockStockData(ticker, days);
            displayStockChart(mockData, ticker);
            return;
        }
        
        // Real API call (commented out for now)
        /*
        fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDateStr}/${toDateStr}?apiKey=${POLYGON_API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    displayStockChart(data.results, ticker);
                } else {
                    throw new Error('No data available for this ticker');
                }
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                alert('Error fetching stock data: ' + error.message);
            });
        */
    }
    
    function fetchRedditStocks() {
        // Use current date in YYYY-MM-DD format
        const currentDate = new Date();
        const dateStr = formatDate(currentDate);
        
        fetch(`https://tradestie.com/api/v1/apps/reddit?date=${dateStr}`)
            .then(response => response.json())
            .then(data => {
                // Sort by comment count and take top 5
                const topStocks = data.sort((a, b) => b.no_of_comments - a.no_of_comments).slice(0, 5);
                displayRedditStocks(topStocks);
            })
            .catch(error => {
                console.error('Error fetching Reddit stocks:', error);
                // Use mock data if API fails
                const mockData = [
                    { ticker: 'GME', no_of_comments: 12500, sentiment: 'Bullish' },
                    { ticker: 'AMC', no_of_comments: 9800, sentiment: 'Bullish' },
                    { ticker: 'AAPL', no_of_comments: 7500, sentiment: 'Bullish' },
                    { ticker: 'TSLA', no_of_comments: 6800, sentiment: 'Bearish' },
                    { ticker: 'MSFT', no_of_comments: 5200, sentiment: 'Bullish' }
                ];
                displayRedditStocks(mockData);
            });
    }
    
    function displayRedditStocks(stocks) {
        const tableBody = document.querySelector('#redditStocksTable tbody');
        tableBody.innerHTML = '';
        
        stocks.forEach(stock => {
            const row = document.createElement('tr');
            
            // Ticker with link to Yahoo Finance
            const tickerCell = document.createElement('td');
            const tickerLink = document.createElement('a');
            tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
            tickerLink.target = '_blank';
            tickerLink.textContent = stock.ticker;
            tickerCell.appendChild(tickerLink);
            
            // Comment count
            const commentsCell = document.createElement('td');
            commentsCell.textContent = stock.no_of_comments.toLocaleString();
            
            // Sentiment with icon
            const sentimentCell = document.createElement('td');
            const sentimentIcon = document.createElement('img');
            sentimentIcon.className = 'sentiment-icon';
            
            if (stock.sentiment.toLowerCase() === 'bullish') {
                sentimentIcon.src = 'https://cdn-icons-png.flaticon.com/512/2521/2521826.png';
                sentimentIcon.alt = 'Bullish';
            } else {
                sentimentIcon.src = 'https://cdn-icons-png.flaticon.com/512/2521/2521843.png';
                sentimentIcon.alt = 'Bearish';
            }
            
            sentimentCell.appendChild(sentimentIcon);
            sentimentCell.appendChild(document.createTextNode(` ${stock.sentiment}`));
            
            row.appendChild(tickerCell);
            row.appendChild(commentsCell);
            row.appendChild(sentimentCell);
            
            tableBody.appendChild(row);
        });
    }
    
    function displayStockChart(stockData, ticker) {
        const ctx = document.getElementById('stockChart').getContext('2d');
        
        // Prepare data for Chart.js
        const labels = stockData.map(item => {
            // Convert epoch milliseconds to date
            const date = new Date(item.t);
            return date.toLocaleDateString();
        });
        
        const dataPoints = stockData.map(item => item.c); // Closing price
        
        // Destroy previous chart if it exists
        if (stockChart) {
            stockChart.destroy();
        }
        
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${ticker} Closing Price`,
                    data: dataPoints,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Helper function to generate mock stock data
    function generateMockStockData(ticker, days) {
        const data = [];
        const basePrice = Math.random() * 100 + 50; // Random base price between 50 and 150
        let currentPrice = basePrice;
        const today = new Date();
        
        for (let i = parseInt(days); i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Random price movement
            const change = (Math.random() - 0.5) * 5;
            currentPrice += change;
            
            // Ensure price doesn't go negative
            currentPrice = Math.max(1, currentPrice);
            
            data.push({
                t: date.getTime(), // Epoch time
                c: parseFloat(currentPrice.toFixed(2)) // Closing price
            });
        }
        
        return data;
    }
});