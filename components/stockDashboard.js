import { Fragment, useEffect, useState } from "react";
import { getRealTimePrice, setFloatingPoint } from "../lib/stocks";
import Image from "next/image";
import styles from "./stockDashboard.module.scss";

export default function StockDashboard({ stockInfo }) {
  const { stockDetail, dashboardInfo } = stockInfo;
  const {
    industry,
    sector,
    marketCap,
    employees,
    ceo,
    url,
    description,
    name,
    symbol,
    hq_state,
    hq_country,
    tags,
    similar,
  } = dashboardInfo;
  console.log(dashboardInfo);
  // const [realTimePrice, setRealTimePrice] = useState(0);

  // useEffect(async () => {
  //   const currentPrice = await getRealTimePrice(symbol.toUpperCase());
  //   setRealTimePrice(currentPrice);
  // }, []);

  // const handleClick = async () => {
  //   const price = await getRealTimePrice(symbol.toUpperCase());
  //   setRealTimePrice(setFloatingPoint(price));
  // };

  return (
    <Fragment>
      {/* <h2 className={styles.companyName}>{symbol}</h2> */}
      {/* <h5>Symbol: {symbol}</h5>
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
      <h5>Stock Exchange: {stockExchange}</h5> */}
    </Fragment>
  );
}
