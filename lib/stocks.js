import axios from "axios";
import { filter, concat, orderBy, flatten } from "lodash";

export const STOCKS_PER_PAGE = 25;
export const FLOATING_POINT = 3;
export const DAY_GAINERS = "DAY_GAINERS";
export const DAY_LOSERS = "DAY_LOSERS";
export const MOST_ACTIVES = "MOST_ACTIVES";
export const SYMBOL_REG_EXPRESS = new RegExp("^[a-zA-Z ]+$");

export async function getStockByNames(symbols) {
  var options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
    params: { symbols: symbols.join().toUpperCase(), region: "US" },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    },
  };
  const data = await axios
    .request(options)
    .then((res) => {
      return res.data.quoteResponse.result;
    })
    .catch((err) => {
      console.error(err);
    });

  const allStocks = data
    ? data.map((stock) => {
        return {
          ...stock,
          symbol: stock.symbol,
          currentPrice:
            digitSeparatorWithComma(
              setFloatingPoint(stock.regularMarketPrice)
            ) || "N/A",
          afterHoursPrice:
            digitSeparatorWithComma(setFloatingPoint(stock.postMarketPrice)) ||
            "N/A",
          priceRange: stock.regularMarketDayRange || "N/A",
          priceChange:
            digitSeparatorWithComma(
              setFloatingPoint(stock.regularMarketChange)
            ) || "N/A",
          priceChangePercent:
            digitSeparatorWithComma(
              setFloatingPoint(stock.regularMarketChangePercent)
            ) || "N/A",
          dividendYield: stock.dividendYield || "N/A",
          marketCap: digitSeparatorWithComma(stock.marketCap) || "N/A",
          stockExchange: stock.fullExchangeName || "N/A",
        };
      })
    : null;

  return allStocks;
}

export async function getMovers(start, pageLimit = STOCKS_PER_PAGE) {
  const options = {
    method: "GET",
    url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers",
    params: { region: "US", lang: "en-US", count: pageLimit, start: start },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    },
  };

  const data = await axios
    .request(options)
    .then((res) => {
      return res.data.finance.result;
    })
    .catch((err) => {
      console.error(err);
    });

  const movers = {};
  data
    ? data.forEach((mover) => {
        if (mover.canonicalName === "DAY_GAINERS") {
          let dayGainers = {};
          dayGainers["total"] = mover.total;
          dayGainers["data"] = mover.quotes.map((quote) => quote.symbol);
          movers["dayGainers"] = dayGainers;
        } else if (mover.canonicalName === "DAY_LOSERS") {
          let dayLosers = {};
          dayLosers["total"] = mover.total;
          dayLosers["data"] = mover.quotes.map((quote) => quote.symbol);
          movers["dayLosers"] = dayLosers;
        } else if (mover.canonicalName === "MOST_ACTIVES") {
          let mostActives = {};
          mostActives["total"] = mover.total;
          mostActives["data"] = mover.quotes.map((quote) => quote.symbol);
          movers["mostActives"] = mostActives;
        }
      })
    : null;

  return movers;
}

export async function getStockForDashboard(symbol) {
  const key = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  var url = new URL(
    `https://api.polygon.io/v1/meta/symbols/${symbol.toUpperCase()}/company?&apiKey=${key}`
  );

  // data = {logo: "...", listdate: "1990-01-02", ... , tags: [...], similar: [...]}

  const data = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return data;
}

export async function getStockNews(symbol, limit = 100) {
  const key = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  // Convert date to string with format "Year-Month-Day"
  // Get one month before current date
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let dt = date.getDate();
  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  date = year + "-" + month + "-" + dt;

  var url = new URL(
    `https://api.polygon.io/v2/reference/news?limit=${limit}&order=descending&sort=published_utc&ticker=${symbol.toUpperCase()}&published_utc.gte=${date}&apiKey=${key}`
  );

  // data = {results: [ {id: "..." , publisher: {name: "..." , ... , } }] status: "OK", count: 100}
  const data = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return data;
}

export function digitSeparatorWithComma(num) {
  if (!num) return;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function setFloatingPoint(num) {
  if (!num) return;

  return parseFloat(num).toFixed(FLOATING_POINT);
}

export function sortByDividendYield(data = [], isDescending = true) {
  let noDividend = filter(data, function (o) {
    return o.dividendYield === "N/A";
  });
  let withDividend = filter(data, function (o) {
    return o.dividendYield !== "N/A";
  });
  return concat(
    orderBy(withDividend, ["dividendYield"], [isDescending ? "desc" : "asc"]),
    orderBy(noDividend, ["marketCap"], [isDescending ? "desc" : "asc"])
  );
}

export async function getAllStocks(country = "US", exchange = "") {
  var options = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/stocks",
    params: { country: country, exchange: exchange, format: "json" },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
    },
  };

  const data = await axios
    .request(options)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return flatten(data);
}

export async function getAllStockIds() {
  const stocks = await getAllStocks();
  return stocks.map((stock) => {
    return {
      params: {
        id: stock.symbol.toLowerCase(),
      },
    };
  });
}

export async function getRealTimePrice(symbols) {
  var options = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/price",
    params: {
      symbol: symbols.join().toUpperCase(),
      format: "json",
      outputsize: "30",
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
    },
  };

  const price = await axios
    .request(options)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return price;
}

export async function getStockStatistics(symbol, isDailyPrice = false) {
  var options = {
    method: "GET",
    url: "https://twelve-data1.p.rapidapi.com/time_series",
    params: {
      symbol: symbol.toUpperCase(),
      interval: isDailyPrice ? "1min" : "1day",
      outputsize: isDailyPrice ? "385" : "5000",
      format: "json",
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
      "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
    },
  };

  const data = await axios
    .request(options)
    .then((res) => {
      return res.data.values;
    })
    .catch((err) => {
      console.error(err);
    });

  return data;
}

export function convertArrayToDataPoints(data) {
  let volumePoints = [];
  let highPoints = [];
  let lowPoints = [];
  let openPoints = [];
  let closePoints = [];
  let allDataPoints = [];

  for (var i = 0; i < data.length; i++) {
    volumePoints.push({
      x: new Date(data[i].datetime),
      y: Number(data[i].volume),
    });

    highPoints.push({
      x: new Date(data[i].datetime),
      y: Number(data[i].high),
    });

    lowPoints.push({
      x: new Date(data[i].datetime),
      y: Number(data[i].low),
    });

    openPoints.push({
      x: new Date(data[i].datetime),
      y: Number(data[i].open),
    });

    closePoints.push({
      x: new Date(data[i].datetime),
      y: Number(data[i].close),
    });

    allDataPoints.push({
      x: new Date(data[i].datetime),
      y: [
        Number(data[i].open),
        Number(data[i].high),
        Number(data[i].low),
        Number(data[i].close),
      ],
    });
  }

  return {
    volumePoints,
    highPoints,
    lowPoints,
    openPoints,
    closePoints,
    allDataPoints,
  };
}
