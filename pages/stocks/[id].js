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
import StockDashboard from "../../components/stockDashboard";

const Chart = dynamic(() => import("../../components/chart"), {
  ssr: false,
});

export async function getStaticProps({ params }) {
  const initalData = {
    stockStats: await getStockStatistics(params.id.toUpperCase(), false),
    stockStatsDaily: await getStockStatistics(params.id.toUpperCase(), true),
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
  const { stockInfo, stockStats, stockStatsDaily } = initalData;

  return (
    <Fragment>
      <div className={styles.container}>
        <Head>
          <title>{stockInfo[0].symbol}</title>
        </Head>

        <Link href="/">
          <button
            type="button"
            className={`btn btn-outline-warning ${styles.button}`}
          >
            <a>Home</a>
          </button>
        </Link>

        <div className={styles.infoSection}>
          <StockDashboard stockInfo={stockInfo[0]} />
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.chartSection}>
            <Chart
              stockStats={stockStatsDaily}
              symbol={stockInfo[0].symbol}
              isDayChart={true}
            />
          </div>
          <div className={styles.chartSection}>
            <Chart
              stockStats={stockStats}
              symbol={stockInfo[0].symbol}
              isDayChart={false}
            />
          </div>
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
    </Fragment>
  );
}
