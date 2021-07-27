import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { getStockByNames, getAllStockIds } from "../../lib/stocks";
const Chart = dynamic(() => import("../../components/chart"), {
  ssr: false,
});

export async function getStaticProps({ params }) {
  const initalData = await getStockByNames([params.id.toUpperCase()]);

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
  return (
    <Fragment>
      <Head>
        <title>{initalData[0].symbol}</title>
        <Script
          type="text/javascript"
          src="../../scripts/canvasjs.stock.min.js"
          strategy="beforeInteractive"
        />
      </Head>

      <h1>{initalData[0].symbol}</h1>

      <Chart />

      <Link href="/">
        <a>Go Back to Home</a>
      </Link>
    </Fragment>
  );
}
