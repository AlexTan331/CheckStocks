import axios from "axios";

export const stocksPerPage = 25;
export const floatingPoint = 2;

// export async function getStockByNames(symbols) {
//   var options = {
//     method: "GET",
//     url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
//     params: { symbols: symbols.join(), region: "US" },
//     headers: {
//       "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
//       "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//     },
//   };
//   const data = await axios
//     .request(options)
//     .then((res) => {
//       return res.data.quoteResponse.result;
//     })
//     .catch((err) => {
//       console.error(err);
//     });

//   const allStocks = data
//     ? data.map((stock) => {
//         return {
//           symbol: stock.symbol,
//           currentPrice: stock.regularMarketPrice || "N/A",
//           afterHoursPrice: stock.postMarketPrice || "N/A",
//           priceRange: stock.regularMarketDayRange || "N/A",
//           dividendYield: stock.dividendYield || "N/A",
//           marketCap: stock.marketCap || "N/A",
//           stockExchange: stock.fullExchangeName || "N/A",
//         };
//       })
//     : undefined;

//   return allStocks;
// }

// export async function getMovers(start) {
//   const options = {
//     method: "GET",
//     url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers",
//     params: { region: "US", lang: "en-US", count: stocksPerPage, start: start },
//     headers: {
//       "x-rapidapi-key": process.env.NEXT_PUBLIC_API_SECRET_KEY,
//       "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//     },
//   };

//   const data = await axios
//     .request(options)
//     .then((res) => {
//       return res.data.finance.result;
//     })
//     .catch((err) => {
//       console.error(err);
//     });

//   const movers = data
//     ? data.map((mover) => {
//         if (mover.canonicalName === "DAY_GAINERS") {
//           return {
//             total: mover.total,
//             dayGainers: mover.quotes.map((quote) => quote.symbol),
//           };
//         } else if (mover.canonicalName === "DAY_LOSERS") {
//           return {
//             total: mover.total,
//             dayLosers: mover.quotes.map((quote) => quote.symbol),
//           };
//         } else if (mover.canonicalName === "MOST_ACTIVES") {
//           return {
//             total: mover.total,
//             mostActives: mover.quotes.map((quote) => quote.symbol),
//           };
//         }
//       })
//     : undefined;

//   return movers;
// }

export async function getStockByNames(symbols) {
  var url = new URL("http://localhost:3000/api/stocks");
  var params = { symbols: symbols.join() };
  url.search = new URLSearchParams(params).toString();

  const data = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => data.quoteResponse.result)
    .catch((err) => {
      console.error(err);
    });

  const allStocks = data
    ? data.map((stock) => {
        return {
          symbol: stock.symbol,
          currentPrice:
            digitSeparatorWithComma(stock.regularMarketPrice) || "N/A",
          afterHoursPrice:
            digitSeparatorWithComma(stock.postMarketPrice) || "N/A",
          priceRange: stock.regularMarketDayRange || "N/A",
          priceChange: setFloatingPoint(stock.regularMarketChange) || "N/A",
          priceChangePercent:
            setFloatingPoint(stock.regularMarketChangePercent) || "N/A",
          dividendYield: stock.dividendYield || "N/A",
          marketCap: digitSeparatorWithComma(stock.marketCap) || "N/A",
          stockExchange: stock.fullExchangeName || "N/A",
        };
      })
    : undefined;

  return allStocks;
}

export async function getMovers(start) {
  var url = new URL("http://localhost:3000/api/movers");
  var params = { start, count: stocksPerPage };
  url.search = new URLSearchParams(params).toString();

  const data = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => data.finance.result)
    .catch((err) => {
      console.error(err);
    });

  const movers = data
    ? data.map((mover) => {
        if (mover.canonicalName === "DAY_GAINERS") {
          return {
            total: mover.total,
            dayGainers: mover.quotes.map((quote) => quote.symbol),
          };
        } else if (mover.canonicalName === "DAY_LOSERS") {
          return {
            total: mover.total,
            dayLosers: mover.quotes.map((quote) => quote.symbol),
          };
        } else if (mover.canonicalName === "MOST_ACTIVES") {
          return {
            total: mover.total,
            mostActives: mover.quotes.map((quote) => quote.symbol),
          };
        }
      })
    : undefined;

  return movers;
}

export function digitSeparatorWithComma(num) {
  if (!num) return;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function setFloatingPoint(num) {
  if (!num) return;
  return num.toFixed(floatingPoint);
}
