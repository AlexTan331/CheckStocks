import { Fragment } from "react";
import Link from "next/link";
import Lottie from "react-lottie";
import * as launching from "../public/images/launching.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: launching,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Loading() {
  return (
    <Fragment>
      <Lottie
        style={{
          background: "rgba(180, 245, 223, 0)",
          position: "fixed",
          left: 0,
          bottom: 0,
        }}
        options={defaultOptions}
        height={200}
        width={200}
        isClickToPausseDisabled={true}
      />
      <h5
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          fontSize: "12px",
          fontWeight: 100,
        }}
      >
        Animation by Asim Das on{" "}
        <Link href="https://lottiefiles.com/69856-boost">
          <a target="_blank">LottieFiles</a>
        </Link>
      </h5>
    </Fragment>
  );
}
