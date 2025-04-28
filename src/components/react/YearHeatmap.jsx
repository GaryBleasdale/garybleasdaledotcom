import { useEffect } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

export default function YearHeatmap(yearData){
    let yearDataArr =  yearData.yearData
    useEffect(() => {
        const cal = new CalHeatmap();
        cal.paint(
          {
            data: {
              source: yearDataArr,
              x: "date",
              y: "value",
              groupY: "sum",
              defaultValue: 0,
            },
            date: { start: new Date(`${yearDataArr[0].date.split('-')[0]}-01-01`) },
            range: 12,
            scale: {
              color: {
                type: "threshold",
                range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
                domain: [0, 1, 2, 5, 10],
              },
            },
            domain: {
              type: "month",
              gutter: 4,
              label: { text: "MMM", textAlign: "start", position: "top" },
            },
            subDomain: {
              type: "ghDay",
              radius: 2,
              width: 11,
              height: 11,
              gutter: 4,
            },
            itemSelector: "#ex-ghDay",
          },
          [
            [
              Tooltip,
              {
                text: function (date, value, dayjsDate) {
                  return (
                    (value ? value : "No") +
                    " contributions on " +
                    dayjsDate.format("dddd, MMMM D, YYYY")
                  );
                },
              },
            ],
            [
              LegendLite,
              {
                includeBlank: true,
                itemSelector: "#ex-ghDay-legend",
                radius: 2,
                width: 11,
                height: 11,
                gutter: 4,
              },
            ],
            [
              CalendarLabel,
              {
                width: 30,
                textAlign: "start",
                text: () =>
                  dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
                padding: [25, 0, 0, 0],
              },
            ],
          ]
        );
    });
  
    return (
        <div>
          <div id="ex-ghDay" className="margin-bottom--md"></div>
        </div>
    );
  }
