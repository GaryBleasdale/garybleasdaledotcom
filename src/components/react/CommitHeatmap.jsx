// src/components/react/CommitHeatmap.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';

export default function CommitHeatmap({ availableYears, initialYear }) {
  const heatmapRef = useRef(null);
  const cal = useRef(null);


  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [commitData, setCommitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // --- Data Fetching Logic ---
  const fetchDataForYear = useCallback(async (year) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);
      // Don't clear commitData immediately

      try {
          console.log(`Fetching data for year: ${year}`);
          const response = await fetch(`/api/commits/${year}.json`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          setCommitData(data); // Update state
      } catch (e) {
          setError(e.message);
          setCommitData({}); // Clear data on error
          console.error(`Failed to fetch commit data for year ${year}:`, e);
      } finally {
          setIsLoading(false);
      }
  }, [isLoading]);

  // Effect to trigger data fetch
  useEffect(() => {
    if (selectedYear !== null) {
      fetchDataForYear(selectedYear);
    }
  }, [selectedYear, fetchDataForYear]);

  // --- Cal-Heatmap Initialization and Update Logic ---
  useEffect(() => {
    if (!heatmapRef.current) {
        console.warn("Heatmap container ref is not available.");
        return;
    }

    // Define common CalHeatmap configuration
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
        date: { start: `${selectedYear}-01-01` },
        range: 12,
        scale: {
          color: {
            type: 'threshold',
            range: ['#14432a', '#166b34', '#37a446', '#4dd05a'],
            domain: [ 1, 2, 5],
          }
        },
        plugins: [
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
                    itemSelector: '#ex-ghDay-legend',
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
                  text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
                  padding: [25, 0, 0, 0],
                },
             ],
        ]
    };

    // --- Initialize or Update CalHeatmap ---
    console.log('commit data', commitData)
    if (!cal.current) {
      // First render: Initialize CalHeatmap using paint()
      console.log('Initializing CalHeatmap instance with paint()...');
      cal.current = new CalHeatmap();

      // cal.paint() takes config object and plugins array
      cal.current.paint(
          {
              ...defaultCalConfig,
              data: {
                  source: commitData,
                  x: "date",
                  y: "value",
                  groupy:"sum"
              },
          },
          defaultCalConfig.plugins 
      );

      console.log('CalHeatmap initialized with paint().');
      setIsLoading(false);
    } else if (!isLoading) {
        // Subsequent renders: Update CalHeatmap using update() or jumpTo()

        console.log(`Updating heatmap view or data for year ${selectedYear}...`);

        // Check if the year displayed by cal-heatmap needs to change
        // Use getView().options.start to get the current start date object
        const currentCalStartDate = cal.current.getView().options.start;
        const currentCalYear = currentCalStartDate ? currentCalStartDate.getFullYear() : null;

        if (currentCalYear !== selectedYear) {
             console.log(`Jumping CalHeatmap view from ${currentCalYear} to ${selectedYear}`);
             // Jump the calendar view to the start of the new selected year
             // jumpTo takes a Date object
             cal.current.jumpTo(new Date(selectedYear, 0, 1));
        }

        // Update the data displayed on the heatmap
        // cal-heatmap's update method takes the data object directly
        // Ensure commitData is in the format { timestamp: count }
        cal.current.update(commitData, false); // false means don't re-init plugins etc.
        console.log('CalHeatmap data updated.');
    }

    // --- Cleanup Function ---
    return () => {
      // Destroy the CalHeatmap instance when the component unmounts
      if (cal.current) {
        console.log('Destroying CalHeatmap instance...');
        cal.current.destroy();
        cal.current = null; // Clear the ref
      }
    };

  }, [commitData, selectedYear, isLoading]); // Dependencies

  // --- Render Logic ---
  const handleYearSelect = (year) => {
     if (year !== selectedYear) {
         setSelectedYear(year); // This state change triggers the data fetch effect
     }
  };

  return (
    <div>
       {/* Year Selection Buttons */}
       <div style={{ marginBottom: '15px', textAlign: 'right' }}>
           {availableYears.map(year => (
               <button
                   key={year}
                   onClick={() => handleYearSelect(year)}
                   disabled={isLoading}
                   style={{
                       margin: '0 2px',
                       padding: '4px 8px',
                       cursor: isLoading ? 'not-allowed' : 'pointer',
                       border: '1px solid #444',
                       background: year === selectedYear ? '#0969da' : '#2d333b',
                       color: year === selectedYear ? '#ffffff' : '#adbac7',
                       borderRadius: '4px',
                       fontSize: '12px',
                       opacity: isLoading ? 0.6 : 1,
                       pointerEvents: isLoading ? 'none' : 'auto',
                   }}
                   aria-pressed={year === selectedYear}
               >
                   {year}
               </button>
           ))}
       </div>

       {/* Loading, Error, or No Data Messages */}
       {isLoading && <p style={{color: '#768390'}}>Loading heatmap data for {selectedYear}...</p>}
       {!isLoading && error && (
         <p style={{ color: 'red' }}>Error loading data: {error}</p>
       )}
       {!isLoading && !error && Object.keys(commitData).length === 0 && (
           <p style={{color: '#768390'}}>No commit data available for {selectedYear}.</p>
       )}

       {/* Heatmap Container */}
       <div ref={heatmapRef} style={{ minHeight: '100px' }}>
       </div>

       {/* The legend div is outside this component */}
    </div>
  );
}