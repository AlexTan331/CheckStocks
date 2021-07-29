import { Fragment, useState } from "react";
import { getRealTimePrice, setFloatingPoint } from "../lib/stocks";
import styles from "./stockDashboard.module.scss";

export default function StockDashboard({ stockInfo }) {
  const {
    symbol,
    afterHoursPrice,
    currentPrice,
    priceRange,
    dividendYield,
    marketCap,
    stockExchange,
  } = stockInfo;

  const [realTimePrice, setRealTimePrice] = useState(currentPrice);

  const handleClick = async () => {
    const price = await getRealTimePrice(symbol);
    setRealTimePrice(setFloatingPoint(price));
  };

  return (
    <Fragment>
      <h5>Symbol: {symbol}</h5>
      <h5>
        Cuurent Price: {realTimePrice}{" "}
        <button
          type="button"
          className={`btn btn-info btn-sm ${styles.button}`}
          onClick={handleClick}
        >
          Refresh
        </button>{" "}
      </h5>
      <h5>Afterhours Price: {afterHoursPrice}</h5>
      <h5>Price Range: {priceRange}</h5>
      <h5>Dividend Yield: {dividendYield}</h5>
      <h5>Market Cap: {marketCap}</h5>
      <h5>Stock Exchange: {stockExchange}</h5>
    </Fragment>
  );
}
