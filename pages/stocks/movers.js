import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.scss";
import CustomTable from "../../components/customTable";
import Pagination from "../../components/pagination";
import {
  getStockByNames,
  getMovers,
  sortByDividendYield,
  STOCKS_PER_PAGE,
  DAY_GAINERS,
  DAY_LOSERS,
  MOST_ACTIVES,
  getAllStocks,
} from "../../lib/stocks";
import { PAGE_NEIGHBOURS } from "../../lib/pagination";

export async function getStaticProps() {
  const movers = await getMovers(0);
  const initalData = movers
    ? {
        total: movers.dayGainers.total,
        dayGainers: await getStockByNames(movers.dayGainers.data),
      }
    : null;
  return {
    props: {
      initalData,
    },
  };
}

export default function Movers({ initalData }) {
  const { total, dayGainers } = initalData;
  const [totalStocks, setTotalStocks] = useState(total || null);
  const [currentStocks, setCurrentStocks] = useState(dayGainers || []);
  const [currentPage, setCurrentPage] = useState(total ? 1 : null);
  const [totalPages, setTotalPages] = useState(
    total ? Math.ceil(total / STOCKS_PER_PAGE) : null
  );
  const [selectedCategory, setSelectedCategory] = useState(DAY_GAINERS);

  const fetchData = async (category, offset = 0) => {
    const movers = await getMovers(offset, STOCKS_PER_PAGE);
    let total;
    let currentStocks;

    switch (category) {
      case DAY_GAINERS:
        total = movers.dayGainers.total;
        currentStocks = await getStockByNames(movers.dayGainers.data);
        break;
      case DAY_LOSERS:
        total = movers.dayLosers.total;
        currentStocks = await getStockByNames(movers.dayLosers.data);
        break;
      case MOST_ACTIVES:
        total = movers.mostActives.total;
        currentStocks = await getStockByNames(movers.mostActives.data);
        break;
      default:
        break;
    }

    return { total, currentStocks };
  };

  const handleCategoryChange = async (evt) => {
    const { total, currentStocks } = await fetchData(evt.target.name, 0);
    setSelectedCategory(evt.target.name);
    setTotalStocks(total);
    setCurrentStocks(currentStocks);
    setCurrentPage(1);
    setTotalPages(Math.ceil(total / STOCKS_PER_PAGE));
  };

  const gotoPage = async (page) => {
    const currentPage = Math.max(0, Math.min(page, totalPages));
    const offset = (currentPage - 1) * STOCKS_PER_PAGE;
    const { total, currentStocks } = await fetchData(selectedCategory, offset);
    setCurrentPage(currentPage);
    setCurrentStocks(currentStocks);
    setTotalStocks(total);
    setTotalPages(Math.ceil(total / STOCKS_PER_PAGE));
  };

  const handleClick = (page) => (evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - PAGE_NEIGHBOURS * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + PAGE_NEIGHBOURS * 2 + 1);
  };

  const headerClass = [
    "text-dark py-2 pr-4 m-0",
    currentPage ? "border-gray border-right" : "",
  ]
    .join(" ")
    .trim();

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
          currentStocks={currentStocks}
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
        <div className="w-70 px-1 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between pagination-container">
          <div className="d-flex flex-row align-items-center">
            <h2 className={headerClass}>
              <strong className="text-secondary">{totalStocks}</strong> stocks
            </h2>

            {currentPage && (
              <span className="current-page d-inline-block h-10 pl-1 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                <span className="font-weight-bold">{totalPages}</span>
              </span>
            )}
          </div>

          <div className="d-flex flex-row py-4 align-items-center">
            <Pagination
              totalRecords={totalStocks}
              totalPages={totalPages}
              currentPage={currentPage}
              handleClick={handleClick}
              handleMoveLeft={handleMoveLeft}
              handleMoveRight={handleMoveRight}
            />
          </div>
        </div>
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

// // To do: need to refactor the methods, states are messed up...
// export default function Home({ initalData }) {
//   const [total, setTotal] = useState(initalData ? initalData.total : 0);
//   const [currentOffset, setCurrentOffset] = useState(0);
//   const [data, setData] = useState(initalData);
//   const [disablePrev, setDisablePrev] = useState("disabled");
//   const [disableNext, setDisableNext] = useState(
//     initalData.total > 0 ? "" : "disabled"
//   );
//   const [selectedCategory, setSelectedCategory] = useState("dayGainers");

//   useEffect(() => {
//     fetchData(currentOffset);
//   }, [selectedCategory, currentOffset, disablePrev, disableNext, total]);

//   const fetchData = async (currentOffset) => {
//     const movers = await getMovers(currentOffset);

//     let total = {};
//     let data = {};

//     switch (selectedCategory) {
//       case "dayGainers":
//         total[total] = movers[0].total;
//         data[dayGainers] = await getStockByNames(movers[0].dayGainers);
//         break;
//       case "dayLosers":
//         total[total] = movers[1].total;
//         data[dayLosers] = await getStockByNames(movers[1].dayLosers);
//         break;
//       case "mostActives":
//         total[total] = movers[2].total;
//         data[mostActives] = await getStockByNames(movers[2].mostActives);
//         break;
//       default:
//         break;
//     }

//     const stocksInfo = {
//       ...total,
//       ...data,
//     };
//     setTotal(total[total]);
//     setData(stocksInfo);
//   };

//   const handlePrev = () => {
//     if (currentOffset <= 0) {
//       return;
//     } else {
//       setCurrentOffset(currentOffset - STOCKS_PER_PAGE);
//     }
//   };

//   const handleNext = () => {
//     if (currentOffset + STOCKS_PER_PAGE >= total) {
//       return;
//     } else {
//       setDisablePrev("");
//       setCurrentOffset(currentOffset + STOCKS_PER_PAGE);
//     }
//   };

//   const handleRadioChange = async (e) => {
//     setCurrentOffset(0);
//     setSelectedCategory(e.target.name);
//   };

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Check Your Stocks</title>
//         <meta
//           name="description"
//           content="Check Your Favorite Stocks With Ease"
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="container">
//         <h2>Check out today's gainers / losers / actives</h2>
//         <CustomTable
//           data={data}
//           selectedCategory={selectedCategory}
//           handleRadioChange={handleRadioChange}
//           handlePrev={handlePrev}
//           handleNext={handleNext}
//           disablePrev={disablePrev}
//           disableNext={disableNext}
//         />
//       </main>

//       <footer>
//         <h5>
//           <Link href="https://rapidapi.com/apidojo/api/yahoo-finance1/">
//             <a target="_blank">Source from Rapid API</a>
//           </Link>
//         </h5>
//       </footer>
//     </div>
//   );
// }
