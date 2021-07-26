import "../styles/globals.scss";
import "../styles/pagination.scss";
import "bootstrap/dist/css/bootstrap.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../components/loading";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
      {isLoading && <Loading />}
    </>
  );
}

export default MyApp;
