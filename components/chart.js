import React from "react";
import CanvasJSReact from "../scripts/canvasjs.stock.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
import { convertArrayToDataPoints } from "../lib/stocks";

class Chart extends React.Component {
  render() {
    const {
      volumePoints,
      highPoints,
      lowPoints,
      openPoints,
      closePoints,
      allDataPoints,
    } = convertArrayToDataPoints(this.props.stockStats);

    const options = {
      title: {
        text: "History Price",
        padding: 5,
      },

      animationEnabled: true,
      theme: "dark1",

      charts: [
        {
          title: {
            text: "History Price",
          },
          toolTip: {
            shared: true,
            content: "{name}: ${y}",
          },
          axisY: {
            prefix: "$",
          },
          data: [
            {
              type: "line",
              name: "High Price",
              yValueFormatString: "$#,###.##",
              dataPoints: highPoints,
            },
            {
              type: "line",
              name: "Low Price",
              yValueFormatString: "$#,###.##",
              dataPoints: lowPoints,
            },
          ],
        },
        {
          title: { text: "Volume", padding: 5 },
          data: [
            {
              type: "line",
              dataPoints: volumePoints,
            },
          ],
        },
      ],
      rangeSelector: {
        buttonStyle: {
          backgroundColor: "#000000",
        },
        buttons: [
          {
            range: 1,
            rangeType: "week",
            label: "1 Week",
          },
          {
            range: 1,
            rangeType: "month",
            label: "1 Month",
          },
          {
            range: 2,
            rangeType: "month",
            label: "2 Months",
          },
          {
            range: 6,
            rangeType: "month",
            label: "6 Months",
          },
          {
            range: 1,
            rangeType: "year",
            label: "1 Year",
          },
          {
            rangeType: "all",
            label: "Show All", //Change it to "All"
          },
        ],
        inputFields: {
          startValue: new Date("2019-08-02"),
          endValue: new Date("2021-07-27"),
        },
      },
      navigator: {
        data: [
          {
            dataPoints: openPoints,
          },
        ],
        slider: {
          minimum: new Date("2020-01-17"),
          maximum: new Date("2020-07-27"),
        },
      },
    };
    const containerProps = {
      width: "90%",
      height: "500px",
      margin: "auto",
    };
    return (
      <div>
        <CanvasJSStockChart
          options={options}
          containerProps={containerProps}
          onRef={(ref) => (this.stockChart = ref)}
        />
      </div>
    );
  }
}

export default Chart;
