import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import TypeAhead from "../components/typeAhead";
import { getAllStocks } from "../lib/stocks";

export async function getStaticProps() {
  const suggestions = await getAllStocks();
  return {
    props: {
      suggestions,
    },
  };
}

export default function Home({ suggestions }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Check Your Stocks</title>
        <meta
          name="description"
          content="Check Your Favorite Stocks With Ease"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <h2 className={styles.h2}>Check Your Favorite Stocks With Ease</h2>

        <Link href="/stocks/movers" passHref>
          <button type="button" className={`btn btn-primary ${styles.button}`}>
            <a>Check daily summary</a>
          </button>
        </Link>

        <Link href="#" passHref>
          <button type="button" className={`btn btn-primary ${styles.button}`}>
            <a>Get recommendation</a>
          </button>
        </Link>
        <TypeAhead suggestions={suggestions} />
      </main>

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
  );
}
