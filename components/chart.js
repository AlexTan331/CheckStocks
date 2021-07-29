import React, { Fragment, useState } from "react";
import CanvasJSReact from "../scripts/canvasjs.stock.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
import { convertArrayToDataPoints, getStockStatistics } from "../lib/stocks";

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDayChart: this.props.isDayChart,
      stockStats: this.props.stockStats,
      show: true,
    };
  }

  handleToggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const {
      volumePoints,
      highPoints,
      lowPoints,
      openPoints,
      closePoints,
      allDataPoints,
    } = convertArrayToDataPoints(this.state.stockStats);

    const historyChartOptions = {
      title: {
        text: "Hitory Statistics",
        fontSize: 25,
        padding: 5,
      },

      animationEnabled: true,
      theme: "dark2",

      charts: [
        {
          title: {
            text: "Price",
          },

          axisY: {
            title: "High/Low price",
            interlacedColor: "#F8F1",
            tickLength: 10,
            prefix: "$",
            labelAutoFit: true,
            tickThickness: 5,
            labelAutoFit: true,
            includeZero: false,
          },
          data: [
            {
              type: "candlestick",
              yValueFormatString: "$#,###.##",
              dataPoints: allDataPoints,
            },
          ],
        },
        {
          title: {
            text: "Volume",
            padding: 5,
          },

          axisY: {
            title: "Volume",
            interlacedColor: "#F8F1",
            tickLength: 10,
            labelAutoFit: true,
            tickThickness: 5,
            labelAutoFit: true,
            includeZero: false,
          },

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
      },
      navigator: {
        dynamicUpdate: false,
        slider: {
          minimum: new Date("2018-07-31"),
          maximum: new Date(),
        },
      },
    };

    const dayChartOptions = {
      title: {
        text: "Daily Price",
        padding: 5,
        fontSize: 25,
      },

      animationEnabled: true,
      theme: "dark2",

      charts: [
        {
          title: {
            text: "High/Low Price",
            fontSize: 15,
          },
          toolTip: {
            shared: true,
            content: "{name}: ${y}",
          },
          axisY: {
            prefix: "$",
            title: "High/Low price",
            tickThickness: 5,
            tickLength: 10,
            margin: 20,
            labelAutoFit: true,
            titleFontSize: 12,
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
      ],
      rangeSelector: {
        buttons: [
          {
            rangeType: "all",
            label: "Show All", //Change it to "All"
          },
        ],
        buttonStyle: {
          backgroundColor: "#000000",
        },
      },
      navigator: {
        data: [
          {
            dataPoints: openPoints,
          },
        ],
      },
    };
    const containerProps = {
      width: "90%",
      height: "500px",
      margin: "auto",
    };
    return (
      <Fragment>
        <p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.handleToggle}
          >
            {this.state.show ? "Close" : "Open"} Chart
          </button>
        </p>

        {this.state.show && (
          <CanvasJSStockChart
            options={
              this.state.isDayChart ? dayChartOptions : historyChartOptions
            }
            containerProps={containerProps}
            onRef={(ref) => (this.stockChart = ref)}
          />
        )}
      </Fragment>
    );
  }
}

export default Chart;
