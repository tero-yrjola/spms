const BASE_URL = "https://www.alphavantage.co/query?";
const API_KEY = "H0LW74TMCBD0BJ0F";

export const getUSDPriceFor = (symbol) => {
    const query = "function=TIME_SERIES_INTRADAY&interval=5min&symbol=" + symbol;
    return(sendGetRequest(query));
};

export const getLast100PricesFor = (symbol) => {
    const query = "function=TIME_SERIES_DAILY&symbol=" + symbol;
    return(sendGetRequest(query));
};

export const getEurToUSD = () => {
    const query = "function=CURRENCY_EXCHANGE_RATE&to_currency=USD&from_currency=EUR";
    return(sendGetRequest(query));
};


function sendGetRequest(query) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        const url = BASE_URL + query + "&apikey=" + API_KEY;
        req.open("GET", url);
        req.onload = function(){
            if (req.status === 200) resolve(req.response);
            else reject(Error(req.statusText));
        };
        req.onerror = function () {
            reject(Error("Network Error"));
        };
        req.send();
    })
}
