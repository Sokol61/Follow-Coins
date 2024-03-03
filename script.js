const apiKey = 'ХХХХХХХХХХХХХХХХХХ'; // Замените YOUR_API_KEY на ваш API ключ от CryptoCompare
const trackedCoins = new Set();
let trackingInterval;

async function getAllCoins() {
    const url = `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const coinTable = document.getElementById('coinTable');
            const tbody = coinTable.getElementsByTagName('tbody')[0];

            for (const id in data.Data) {
                const coin = data.Data[id];
                const row = tbody.insertRow();
                const idCell = row.insertCell(0);
                const symbolCell = row.insertCell(1);
                const trackCell = row.insertCell(2);
                const nameCell = row.insertCell(3);

                idCell.textContent = id;
                symbolCell.textContent = coin.Symbol;
                trackCell.innerHTML = `<input type="checkbox" onchange="toggleTracking('${id}')">`;
                nameCell.textContent = coin.CoinName;
            }
        } else {
            console.error('Ошибка при выполнении запроса:', response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

function toggleTracking(coinId) {
    if (trackedCoins.has(coinId)) {
        trackedCoins.delete(coinId);
    } else {
        if (trackedCoins.size >= 10) {
            alert('Максимальное количество отслеживаемых монет составляет 10.');
            return;
        }
        trackedCoins.add(coinId);
    }
}

function trackCoins() {
    const trackedCoinsContainer = document.getElementById('trackedCoins');
    trackedCoinsContainer.innerHTML = '';
    trackingInterval = setInterval(updatePrices, 10000); // Обновление цен каждые 10 секунд
}

async function updatePrices() {
    for (const coinId of trackedCoins) {
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${coinId}&tsyms=USD&api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const price = data.USD;
                const coinElement = document.createElement('div');
                coinElement.textContent = `${coinId}: $${price}`;
                document.getElementById('trackedCoins').appendChild(coinElement);
            } else {
                console.error('Ошибка при выполнении запроса:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }
}

function stopTracking() {
    clearInterval(trackingInterval);
}
