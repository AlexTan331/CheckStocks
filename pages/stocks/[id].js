import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import {
  getStockByNames,
  getAllStockIds,
  getStockStatistics,
  getStockForDashboard,
  getStockNews,
} from "../../lib/stocks";
import styles from "../../styles/stock.module.scss";
import StockDashboard from "../../components/stockDashboard";

const Chart = dynamic(() => import("../../components/chart"), {
  ssr: false,
});

export async function getStaticProps({ params }) {
  const initalData = {
    stockStats: await getStockStatistics(params.id, false),
    stockStatsDaily: await getStockStatistics(params.id, true),
    stockInfo: {
      stockDetail: await getStockByNames([params.id]),
      dashboardInfo: await getStockForDashboard(params.id),
    },
    stockNews: await getStockNews(params.id),
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
  const { stockInfo, stockStats, stockStatsDaily, stockNews } = initalData;

  return (
    <Fragment>
      <div className={styles.container}>
        <Head>
          <title>{stockInfo.stockDetail[0].symbol}</title>
        </Head>

        <Link href="/" passHref>
          <button
            type="button"
            className={`btn btn-outline-warning ${styles.homeButton}`}
          >
            <a>Home</a>
          </button>
        </Link>

        <Link href="/movers" passHref>
          <button
            type="button"
            className={`btn btn-outline-warning ${styles.moverButton}`}
          >
            <a>Movers</a>
          </button>
        </Link>

        <div className={styles.infoSection}>
          <StockDashboard stockInfo={stockInfo} stockNews={stockNews} />
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.chartSection}>
            <Chart
              stockStats={stockStatsDaily}
              symbol={stockInfo.stockDetail[0].symbol}
              isDayChart={true}
            />
          </div>
          <div className={styles.chartSection}>
            <Chart
              stockStats={stockStats}
              symbol={stockInfo.stockDetail[0].symbol}
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
            <Link
              href="https://rapidapi.com/apidojo/api/yahoo-finance1/"
              passHref
            >
              <a
                style={{
                  marginLeft: "10px",
                }}
                target="_blank"
              >
                Yahoo Finance
              </a>
            </Link>
            <Link
              href="https://rapidapi.com/twelvedata/api/twelve-data1/"
              passHref
            >
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
