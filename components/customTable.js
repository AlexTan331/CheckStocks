import Link from "next/link";
import { DAY_GAINERS, DAY_LOSERS, MOST_ACTIVES } from "../lib/stocks";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";
import styles from "./customTable.module.scss";

export default function CustomTable({
  currentStocks,
  selectedCategory,
  handleCategoryChange,
}) {
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
            name={DAY_GAINERS}
            id={DAY_GAINERS}
            autoComplete="off"
            checked={selectedCategory === DAY_GAINERS}
            onChange={handleCategoryChange}
          />
          <label
            className={`btn btn-outline-success ${styles.categoryRadio}`}
            htmlFor={DAY_GAINERS}
          >
            {startCase(toLower(DAY_GAINERS))}
          </label>

          <input
            type="radio"
            className="btn-check"
            name={DAY_LOSERS}
            id={DAY_LOSERS}
            autoComplete="off"
            checked={selectedCategory === DAY_LOSERS}
            onChange={handleCategoryChange}
          />
          <label
            className={`btn btn-outline-danger ${styles.categoryRadio}`}
            htmlFor={DAY_LOSERS}
          >
            {startCase(toLower(DAY_LOSERS))}
          </label>

          <input
            type="radio"
            className="btn-check"
            name={MOST_ACTIVES}
            id={MOST_ACTIVES}
            autoComplete="off"
            checked={selectedCategory === MOST_ACTIVES}
            onChange={handleCategoryChange}
          />
          <label
            className={`btn btn-outline-warning ${styles.categoryRadio}`}
            htmlFor={MOST_ACTIVES}
          >
            {startCase(toLower(MOST_ACTIVES))}
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
              {currentStocks ? (
                currentStocks.map((stock, index) => {
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
                        <Link href={`/stocks/${symbol.toLowerCase()}`} passHref>
                          <button type="button" className="btn btn-info btn-sm">
                            View Details
                          </button>
                        </Link>
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
      </div>
    </>
  );
}
