import { useEffect } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "./calHeatmap.css";

export default function CommitHeatmap() {
  useEffect(() => {
    const years = [2021, 2022, 2023, 2024, 2025];
    for (let i = years.length - 1; i >= 0; i--) {
      const year = years[i];
      const cal = new CalHeatmap();
      console.log("painting");
      cal.paint(
        {
          data: {
            source: [
              { date: `${year}-01-05`, value: 4 },
              { date: `${year}-01-06`, value: 3 },
            ],
            x: "date",
            y: "value",
            groupY: "sum",
            defaultValue: 0,
          },
          date: { start: new Date(`${year}-01-01`) },
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
    }
  });

  return (
    <>
      <div>Heatmaps</div>
      <div
        style={{
          background: "#22272d",
          color: "#adbac7",
          borderRadius: "3px",
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <div id="ex-ghDay" className="margin-bottom--md"></div>
        <div style={{ float: "right", fontSize: 12 }}>
          <span style={{ color: "#768390" }}>Less</span>
          <div
            id="ex-ghDay-legend"
            style={{ display: "inline-block", margin: "0 4px" }}
          ></div>
          <span style={{ color: "#768390", fontSize: 12 }}>More</span>
        </div>
      </div>
    </>
  );
}
