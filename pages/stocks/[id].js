import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { getStockByNames, getAllStockIds } from "../../lib/stocks";

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
      </Head>

      <h1>{initalData[0].symbol}</h1>

      <Link href="/">
        <a>Go Back to Home</a>
      </Link>
    </Fragment>
  );
}
