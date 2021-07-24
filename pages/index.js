import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

export default function Home() {
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
        <h2>Check Your Favorite Stocks With Ease</h2>
        <Link href="/stocks/movers">
          <a>Check daily summary</a>
        </Link>
      </main>

      <footer>
        <h5>
          <Link href="https://rapidapi.com/apidojo/api/yahoo-finance1/">
            <a target="_blank">Source from Rapid API</a>
          </Link>
        </h5>
      </footer>
    </div>
  );
}
