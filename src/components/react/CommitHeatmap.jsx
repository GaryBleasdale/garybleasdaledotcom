import { useEffect, useRef, useState, useCallback } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

export default function CommitHeatmap({ availableYears, initialYear }) {
  const heatmapRef = useRef(null);
  const cal = useRef(null);

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [commitData, setCommitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataForYear = useCallback(
    async (year) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/commits/${year}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setCommitData(data);
      } catch (e) {
        setError(e.message);
        setCommitData({});
        console.error(`Failed to fetch commit data for year ${year}:`, e);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  useEffect(() => {
    if (selectedYear !== null) {
      fetchDataForYear(selectedYear);
    }
  }, [selectedYear, fetchDataForYear]);

  useEffect(() => {
    if (!heatmapRef.current) {
      console.warn("Heatmap container ref is not available.");
      return;
    }

    const defaultCalConfig = {
      itemSelector: heatmapRef.current,
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
      date: {
        start: new Date(`${selectedYear}-01-01`),
      },
      range: 12,
      scale: {
        color: {
          type: "threshold",
          range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
          domain: [1, 2, 5],
        },
      },
      plugins: [
        [
          Tooltip,
          {
            text: function (_timestamp, value, dayjsDate) {
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
      ],
    };

    if (!cal.current) {
      cal.current = new CalHeatmap();

      cal.current.paint(
        {
          ...defaultCalConfig,
          data: {
            source: commitData,
            x: "date",
            y: "value",
            groupy: "sum",
          },
        },
        defaultCalConfig.plugins
      );

      setIsLoading(false);
    } else if (!isLoading) {
      const currentCalStartDate = cal.current.getView().options.start;
      const currentCalYear = currentCalStartDate
        ? currentCalStartDate.getFullYear()
        : null;

      if (currentCalYear !== selectedYear) {
        cal.current.jumpTo(new Date(selectedYear, 0, 1));
      }

      cal.current.update(commitData, false);
    }

    return () => {
      if (cal.current) {
        cal.current.destroy();
        cal.current = null;
      }
    };
  }, [commitData, selectedYear, isLoading]);

  const handleYearSelect = (year) => {
    if (year !== selectedYear) {
      setSelectedYear(year);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "15px", textAlign: "right" }}>
        <div style={{display:'flex', flexDirection:"column"}}>
          <div ref={heatmapRef} style={{ minHeight: "160px", minWidth:"95%" }}>



          {isLoading && (
          <div style={{width:'100%', height:'100%', display:'flex', alignItems:"center", justifyContent:"center"}}>
            <p style={{ color: "#768390" }}>
              {!error &&
              (
              <span>Loading heatmap data for {selectedYear}...</span>
              )
              }
              {
                error&&(
                  <span>Error loading data for {selectedYear}...</span>
                )
              }
            </p>
          </div>
        )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap:"wrap", gap:"15px"}}>
          <div style={{ display: "flex"}}>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                disabled={isLoading}
                style={{
                  margin: "0 2px",
                  padding: "4px 8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  border: "1px solid #444",
                  background: year === selectedYear ? "#0969da" : "#2d333b",
                  color: year === selectedYear ? "#ffffff" : "#adbac7",
                  borderRadius: "4px",
                  fontSize: "12px",
                  opacity: isLoading ? 0.6 : 1,
                  pointerEvents: isLoading ? "none" : "auto",
                }}
                aria-pressed={year === selectedYear}
              >
                {year}
              </button>
            ))}
                    
          </div>
          <div style={{gap:'10px', display:'flex', justifyContent: 'flex-end'}}>
          <a
            className="button button--sm button--secondary margin-top--sm"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              cal.current.previous(2);
            }}
          >
            ← Previous
          </a>
          <a
            className="button button--sm button--secondary margin-top--sm margin-left--xs"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              cal.current.next(2);
              console.log(cal.current.navigator.maxDomainReached);
            }}
          >
            Next →
          </a>
        </div>
          </div>

        </div>


       
      </div>
    </div>
  );
}
