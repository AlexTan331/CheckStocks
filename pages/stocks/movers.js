import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import CustomTable from "../../components/customTable";
import { getStockByNames, getMovers, stocksPerPage } from "../../lib/stocks";

export async function getStaticProps() {
  const movers = await getMovers(0);
  const initalData = movers
    ? {
        total: movers[0].total,
        dayGainers: await getStockByNames(movers[0].dayGainers),
      }
    : undefined;
  return {
    props: {
      initalData,
    },
  };
}

// To do: need to refactor the methods, states are messed up...
export default function Home({ initalData }) {
  const [total, setTotal] = useState(initalData ? initalData.total : 0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [data, setData] = useState(initalData);
  const [disablePrev, setDisablePrev] = useState("disabled");
  const [disableNext, setDisableNext] = useState(
    initalData.total > 0 ? "" : "disabled"
  );
  const [selectedCategory, setSelectedCategory] = useState("dayGainers");

  useEffect(() => {
    fetchData(currentOffset);
  }, [selectedCategory, currentOffset, disablePrev, disableNext, total]);

  const fetchData = async (currentOffset) => {
    const movers = await getMovers(currentOffset);

    let total = {};
    let data = {};

    switch (selectedCategory) {
      case "dayGainers":
        total[total] = movers[0].total;
        data[dayGainers] = await getStockByNames(movers[0].dayGainers);
        break;
      case "dayLosers":
        total[total] = movers[1].total;
        data[dayLosers] = await getStockByNames(movers[1].dayLosers);
        break;
      case "mostActives":
        total[total] = movers[2].total;
        data[mostActives] = await getStockByNames(movers[2].mostActives);
        break;
      default:
        break;
    }

    const stocksInfo = {
      ...total,
      ...data,
    };
    setTotal(total[total]);
    setData(stocksInfo);
  };

  const handlePrev = () => {
    if (currentOffset <= 0) {
      return;
    } else {
      setCurrentOffset(currentOffset - stocksPerPage);
    }
  };

  const handleNext = () => {
    if (currentOffset + stocksPerPage >= total) {
      return;
    } else {
      setDisablePrev("");
      setCurrentOffset(currentOffset + stocksPerPage);
    }
  };

  const handleRadioChange = async (e) => {
    setCurrentOffset(0);
    setSelectedCategory(e.target.name);
  };

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
        <h2>Check out today's gainers / losers / actives</h2>
        <CustomTable
          data={data}
          selectedCategory={selectedCategory}
          handleRadioChange={handleRadioChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          disablePrev={disablePrev}
          disableNext={disableNext}
        />
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
