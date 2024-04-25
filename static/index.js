function calculateEMA(dps, count) {
  var k = 2 / (count + 1);
  var emaDps = [{ x: dps[0].x, y: dps[0].y.length ? dps[0].y[3] : dps[0].y }];
  for (var i = 1; i < dps.length; i++) {
    emaDps.push({ x: dps[i].x, y: (dps[i].y.length ? dps[i].y[3] : dps[i].y) * k + emaDps[i - 1].y * (1 - k) });
  }
  return emaDps;
}

function initChart( data, intervalType, interval, valueFormatString, minimum, maximum) {
  var dps1 = [], dps2 = [];
  for (var i = 0; i < data.length; i++) {
    dps1.push({ x: new Date(data[i].date), y: [Number(data[i].high), Number(data[i].low)], color: data[i].color, transNum: data[i].transNum });
    dps2.push({ x: new Date(data[i].date), y: Number(data[i].high) });
  }
  var ema = calculateEMA(dps2, 7);
  var stockChart = new CanvasJS.StockChart("chartContainer", {
    theme: "light2",
    title: {
      text: "Transaction Monitor"
    },
    subtitles: [{
      text: "Exponential Moving Average of Currency Amount"
    }],
    charts: [{
      axisY: {
        prefix: "$"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        itemclick: function (e) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      axisX: {
        interval: interval,
        intervalType: intervalType,
        valueFormatString: valueFormatString
      },
      data: [{
        indexLabel: "{transNum}",
        indexLabelFormatter: function (e) {
          if (e.index === 0)
            return e.dataPoint.transNum;
          else
            return " ";
        },
        type: "rangeColumn",
        name: "currency amount",
        showInLegend: true,
        yValueFormatString: "$#,###.##",
        xValueType: "dateTime",
        dataPoints: dps1,
      },
      { type: "line", name: "EMA", showInLegend: true, yValueFormatString: "$#,###.##", dataPoints: ema }],
    }],
    navigator: {
      data: [{
        dataPoints: dps2
      }],
      slider: {
        minimum: minimum,
        maximum: maximum
      }
    }
  });
  stockChart.render();
}

function changeChartVersion(value) {
  if (value === "day") {
    data = data_dict.dataDay;
    interval = 1;
    intervalType = "day";
    valueFormatString = "MM-DD";
    minimum = new Date(2022, 03, 01),
      maximum = new Date(2022, 05, 01)
  } else if (value === "week") {
    data = data_dict.dataWeek;
    intervalType = 'day';
    interval = 7;
    valueFormatString = "MM-DD";
    minimum = new Date(2022, 03, 01),
    maximum = new Date(2022, 09, 01)
  } else if (value === "month") {
    data = data_dict.dataMonth;
    intervalType = "month";
    interval = 1;
    valueFormatString = "MMMM";
    minimum = new Date(2022, 01, 01),
    maximum = new Date(2022, 12, 01)
  }
  initChart(data, intervalType, interval, valueFormatString, minimum, maximum);
};

function changeCompareChartVersion(value) {
  if (value === "day") {
    data1 = data1_dict.dataDay;
    data2 = data2_dict.dataDay;
    interval = 1;
    intervalType = "day";
    valueFormatString = "MM-DD";
    minimum = new Date(2022, 03, 01),
    maximum = new Date(2022, 05, 01)
  } else if (value === "week") {
    data1 = data1_dict.dataWeek;
    data2 = data2_dict.dataWeek;
    intervalType = 'day';
    interval = 7;
    valueFormatString = "MM-DD";
    minimum = new Date(2022, 03, 01),
    maximum = new Date(2022, 09, 01)
  } else if (value === "month") {
    data1 = data1_dict.dataMonth;
    data2 = data2_dict.dataMonth;
    intervalType = "month";
    interval = 1;
    valueFormatString = "MMMM";
    minimum = new Date(2022, 01, 01),
    maximum = new Date(2022, 12, 01)
  }
  initCompareChart(data1, data2, intervalType, interval, valueFormatString, minimum, maximum);
};

function initCompareChart(data1, data2, intervalType, interval, valueFormatString, minimum, maximum) {
  var dps1_1 = [], dps1_2 = [];
  var dps2_1 = [], dps2_2 = [];
  for (var i = 0; i < data1.length; i++) {
    dps1_1.push({ x: new Date(data1[i].date), y: [Number(data1[i].high), Number(data1[i].low)], color: data1[i].color, transNum: data1[i].transNum });
    dps1_2.push({ x: new Date(data1[i].date), y: Number(data1[i].high) });
  }
  for (var i = 0; i < data2.length; i++) {
    dps2_1.push({ x: new Date(data2[i].date), y: [Number(data2[i].high), Number(data2[i].low)], color: data2[i].color, transNum: data2[i].transNum });
    dps2_2.push({ x: new Date(data2[i].date), y: Number(data2[i].high) });
  }
  var ema1 = calculateEMA(dps1_2, 7);
  var ema2 = calculateEMA(dps2_2, 7);
  var stockChart2 = new CanvasJS.StockChart("chartContainer", {
    theme: "light2",
    title: {
      fontSize: 30,
      text: "Compare Transaction History"
    },
    subtitles: [{
      fontSize: 15,
      text: "Exponential Moving Average of Currency Amount"
    }],
    rangeSelector: {
      buttonStyle: {
        labelFontSize: 15
      },
      inputFields: {
        style: {
          fontSize: 15
        }
      }
    },
    charts: [{
      axisY: {
        prefix: "$"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        itemclick: function (e) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      axisX: {
        interval: interval,
        intervalType: intervalType,
        valueFormatString: valueFormatString,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
          lineDashType: "solid",
          color: "grey",
          opacity: 0.4,
          thickness: 25
        }
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "rangeColumn",
        name: "currency amount 1",
        showInLegend: true,
        yValueFormatString: "$#,###.##",
        xValueType: "dateTime",
        dataPoints: dps1_1,
        indexLabel: "transNum:{transNum}",
        indexLabelFormatter: function (e) {
          if (e.index === 0)
            return e.dataPoint.transNum;
          else
            return " ";
        },
      },
      { type: "line", name: "EMA 1", showInLegend: true, yValueFormatString: "$#,###.##", dataPoints: ema1 ,color:"#d774e8" },
    ],
    },
    {axisY: {
      prefix: "$"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      itemclick: function (e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    axisX: {
      interval: interval,
      intervalType: intervalType,
      valueFormatString: valueFormatString,
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
        lineDashType: "solid",
        color: "grey",
        opacity: 0.4,
        thickness: 25
      }
    },
    toolTip: {
      shared: true
    },
      data: [
        {
          type: "rangeColumn",
          name: "currency amount 2",
          showInLegend: true,
          yValueFormatString: "$#,###.##",
          xValueType: "dateTime",
          dataPoints: dps2_1,
          indexLabel: "transNum:{transNum}",
          indexLabelFormatter: function (e) {
            if (e.index === 0)
              return e.dataPoint.transNum;
            else
              return " ";
          },
        },{ type: "line", name: "EMA 2", showInLegend: true, yValueFormatString: "$#,###.##", dataPoints: ema2, color:"#74b6e8" }
      ]
    }
  ],
    navigator: {
      data: [{
        dataPoints: dps1_2,
        color:"#d774e8" 
      }, {
        color:"#74b6e8" ,
        dataPoints: dps2_2
      }],
      slider: {
        minimum: minimum,
        maximum: maximum
      }
    }
  });
  stockChart2.render();
};
