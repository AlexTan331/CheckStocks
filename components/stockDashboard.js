import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  digitSeparatorWithComma,
  getRealTimePrice,
  setFloatingPoint,
} from "../lib/stocks";
import styles from "./stockDashboard.module.scss";

export default function StockDashboard({ stockInfo, stockNews }) {
  const router = useRouter();
  console.log(router.asPath);
  const { stockDetail, dashboardInfo } = stockInfo;
  const {
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
  const {
    ask,
    bid,
    fiftyTwoWeekHigh,
    fiftyTwoWeekHighChange,
    fiftyTwoWeekLow,
    fiftyTwoWeekLowChange,
    marketCap,
    totalCash,
  } = stockDetail[0];

  const [realTimePrice, setRealTimePrice] = useState({});

  useEffect(async () => {
    const currentPrice = await getRealTimePrice([symbol]);
    setRealTimePrice(currentPrice);
  }, []);

  const handleClick = async () => {
    const data = await getRealTimePrice([symbol]);
    setRealTimePrice(data);
  };

  return (
    <Fragment>
      <div className={styles.nameContainer}>
        <span className={styles.companySymbol}>{symbol}</span>
        <span className={styles.companyName}>{name}</span>
        <span className={styles.price}>
          $
          {realTimePrice.hasOwnProperty("price")
            ? setFloatingPoint(realTimePrice["price"])
            : "N/A"}{" "}
          <button
            type="button"
            className={`btn btn-info btn-sm ${styles.refreshButton}`}
            onClick={handleClick}
          >
            Refresh
          </button>{" "}
        </span>
      </div>

      <div className={styles.newsContainer}>
        <span className={styles.containerTitle}>Relevant News</span>
        {stockNews.status === "OK" ? (
          stockNews.results.map((news, index) => (
            <div className={styles.news} key={index}>
              <Link href={news.publisher.homepage_url} passHref key={index}>
                <a target="_blank">
                  <span className={styles.newsPublisher} key={index}>
                    {news.publisher.name}
                  </span>
                </a>
              </Link>

              <Link href={news.article_url} passHref>
                <a target="_blank" className={styles.newsTitle}>
                  <span>{news.title}</span>
                </a>
              </Link>

              <div className={styles.newsImage}>
                {/* <img src={news.image_url} alt="article image" /> */}
              </div>

              <span className={styles.date}>{news.published_utc}</span>
            </div>
          ))
        ) : (
          <span> Not Available </span>
        )}
      </div>

      <div className={styles.aboutContainer}>
        <span className={styles.aboutTitle}>
          About {symbol}{" "}
          <Link href={url} passHref>
            <a target="_blank" className={styles.website}>
              (Website)
            </a>
          </Link>
        </span>

        <p className={styles.description}>{description}</p>

        <ul className="list-group list-group-flush align-items-start">
          <li className="list-group-item" key="ceo">
            CEO <span className={styles.value}>{ceo}</span>
          </li>
          <li className="list-group-item" key="hq">
            Headquarters{" "}
            <span className={styles.value}>
              {hq_state || "N/A"}, {hq_country}
            </span>
          </li>
          <li className="list-group-item" key="employees">
            Employees{" "}
            <span className={styles.value}>
              {digitSeparatorWithComma(employees)}
            </span>
          </li>
          <li className="list-group-item" key="tags">
            Section <span className={styles.value}>{tags[0] || "N/A"}</span>
          </li>
          <li className="list-group-item" key="underline"></li>
        </ul>

        <div className={styles.similarSection}>
          <span className={styles.similarTitle}>Similar Stocks:</span>
          <br />
          <div className={styles.similarStock}>
            {similar.length ? (
              similar.map((stock, index) => (
                <Link
                  href={`/stocks/${stock.toLowerCase()}`}
                  passHref
                  key={index}
                >
                  <a>
                    <span
                      className={`card text-white bg-dark ${styles.stockBody}`}
                      key={index}
                    >
                      {stock}
                    </span>
                  </a>
                </Link>
              ))
            ) : (
              <span>Not Available</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <ul className="list-group list-group-flush align-items-start">
          <li className="list-group-item" key="ask">
            Ask Price <span className={styles.value}>${ask}</span>
          </li>
          <li className="list-group-item" key="bid">
            Bid Price <span className={styles.value}>${bid}</span>
          </li>
          <li className="list-group-item" key="marketcap">
            Market Cap <span className={styles.value}>${marketCap}</span>
          </li>
          <li className="list-group-item" key="cash">
            Totol Cash{" "}
            <span className={styles.value}>
              ${digitSeparatorWithComma(totalCash)}
            </span>
          </li>
          <li className="list-group-item" key="high">
            52-week High{" "}
            <span
              className={
                fiftyTwoWeekHighChange && parseFloat(fiftyTwoWeekHighChange) > 0
                  ? `priceUp ${styles.value}`
                  : `priceDown ${styles.value}`
              }
            >
              ${fiftyTwoWeekHigh}&nbsp;&nbsp;{" "}
              {setFloatingPoint(fiftyTwoWeekHighChange)}%
            </span>
          </li>
          <li className="list-group-item" key="low">
            52-week Low{" "}
            <span
              className={
                fiftyTwoWeekLowChange && parseFloat(fiftyTwoWeekLowChange) > 0
                  ? `priceUp ${styles.value}`
                  : `priceDown ${styles.value}`
              }
            >
              ${fiftyTwoWeekLow} &nbsp;&nbsp;{" "}
              {setFloatingPoint(fiftyTwoWeekLowChange)}%
            </span>
          </li>
          <li className="list-group-item" key="underline_1"></li>
        </ul>
      </div>
    </Fragment>
  );
}
