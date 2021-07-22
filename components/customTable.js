import styles from "./customTable.module.css";

export default function CustomTable({
  data,
  selectedCategory,
  handleRadioChange,
  handlePrev,
  handleNext,
  disablePrev,
  disableNext,
}) {
  const quotes = data ? data[Object.keys(data)[1]] : undefined;

  return (
    <>
      <div className={styles.container}>
        <div
          className={`btn-group-lg ${styles.buttonGroupCategory}`}
          role="group"
          aria-label="Button group to select day gainers, losers, or most actives"
        >
          <input
            type="radio"
            className="btn-check"
            name="dayGainers"
            id="dayGainers"
            autoComplete="off"
            checked={selectedCategory === "dayGainers"}
            onChange={handleRadioChange}
          />
          <label
            className={`btn btn-outline-success ${styles.categoryRadio}`}
            htmlFor="dayGainers"
          >
            Day Gainers
          </label>

          <input
            type="radio"
            className="btn-check"
            name="dayLosers"
            id="dayLosers"
            autoComplete="off"
            checked={selectedCategory === "dayLosers"}
            onChange={handleRadioChange}
          />
          <label
            className={`btn btn-outline-danger ${styles.categoryRadio}`}
            htmlFor="dayLosers"
          >
            Day Losers
          </label>

          <input
            type="radio"
            className="btn-check"
            name="mostActives"
            id="mostActives"
            autoComplete="off"
            checked={selectedCategory === "mostActives"}
            onChange={handleRadioChange}
          />
          <label
            className={`btn btn-outline-warning ${styles.categoryRadio}`}
            htmlFor="mostActives"
          >
            Most Actives
          </label>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Symbol</th>
                <th scope="col">Current Price ($)</th>
                <th scope="col">AfterHours Price ($)</th>
                <th scope="col">Price Range ($)</th>
                <th scope="col">Dividend Yield (%)</th>
                <th scope="col">Price Change</th>
                <th scope="col">Market Cap ($)</th>
                <th scope="col">Stock Exchange</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {quotes ? (
                quotes.map((stock, index) => {
                  let {
                    symbol,
                    currentPrice,
                    afterHoursPrice,
                    priceRange,
                    dividendYield,
                    priceChange,
                    priceChangePercent,
                    marketCap,
                    stockExchange,
                  } = stock;
                  return (
                    <tr key={index}>
                      <th scope="row">{index}</th>
                      <td>{symbol}</td>
                      <td>{currentPrice} </td>
                      <td>{afterHoursPrice}</td>
                      <td>{priceRange}</td>
                      <td>{dividendYield}</td>
                      <td
                        className={
                          priceChange &&
                          priceChangePercent &&
                          parseFloat(priceChangePercent) > 0
                            ? "priceUp"
                            : "priceDown"
                        }
                      >
                        ${priceChange} <br /> {priceChangePercent}%
                      </td>
                      <td>{marketCap}</td>
                      <td>{stockExchange}</td>
                      <td>
                        <button type="button" className="btn btn-info btn-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={handlePrev}
          type="button"
          className={`btn btn-outline-secondary ${styles.pageButton} ${disablePrev}`}
        >
          prev
        </button>
        <button
          onClick={handleNext}
          type="button"
          className={`btn btn-outline-success ${styles.pageButton} ${disableNext}`}
        >
          next
        </button>
      </div>
    </>
  );
}
