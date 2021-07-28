import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import {
  getStockByNames,
  getAllStockIds,
  getStockStatistics,
  getRealTimePrice,
} from "../../lib/stocks";
import styles from "../../styles/stock.module.scss";

const Chart = dynamic(() => import("../../components/chart"), {
  ssr: false,
});

export async function getStaticProps({ params }) {
  const initalData = {
    stockStats: await getStockStatistics(params.id.toUpperCase()),
    stockInfo: await getStockByNames([params.id.toUpperCase()]),
  };

  return {
    props: {
      initalData,
    },
  };
}

export async function getStaticPaths() {
  const paths = await getAllStockIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Stock({ initalData }) {
  const { stockInfo, stockStats } = initalData;
  const [currentPrice, setCurrentPrice] = useState(stockInfo[0].currentPrice);

  const handleClick = async () => {
    // const price = await getRealTimePrice(stockInfo[0].symbol);
    // setCurrentPrice(price);
    console.log("click");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{stockInfo[0].symbol}</title>
        <Script
          type="text/javascript"
          src="../../scripts/canvasjs.stock.min.js"
          strategy="beforeInteractive"
        />
      </Head>

      <Link href="/">
        <button type="button" className={`btn btn-primary ${styles.button}`}>
          <a>Go Back Home</a>
        </button>
      </Link>

      <div className={styles.infoSection}>
        <h5>Symbol: {stockInfo[0].symbol}</h5>
        <h5>
          Cuurent Price: {currentPrice}{" "}
          <button
            type="button"
            className={`btn btn-primary btn-sm ${styles.button}`}
            onClick={handleClick}
          >
            Refresh
          </button>{" "}
        </h5>
        <h5>Afterhours Price: {stockInfo[0].afterHoursPrice}</h5>
        <h5>Price Range: {stockInfo[0].priceRange}</h5>
        <h5>Dividend Yield: {stockInfo[0].dividendYield}</h5>
        <h5>Market Cap: {stockInfo[0].marketCap}</h5>
        <h5>Stock Exchange: {stockInfo[0].stockExchange}</h5>
      </div>

      <div className={styles.chartSection}>
        <Chart stockStats={stockStats} />
      </div>

      <footer className={styles.footer}>
        <div
          style={{
            display: "flex",
            fontSize: "20px",
          }}
        >
          Sources from Rapid API --
          <Link href="https://rapidapi.com/apidojo/api/yahoo-finance1/">
            <a
              style={{
                marginLeft: "10px",
              }}
              target="_blank"
            >
              Yahoo Finance
            </a>
          </Link>
          <Link href="https://rapidapi.com/twelvedata/api/twelve-data1/">
            <a
              style={{
                marginLeft: "12px",
              }}
              target="_blank"
            >
              Twelve Data
            </a>
          </Link>
        </div>
      </footer>
    </div>
  );
}
