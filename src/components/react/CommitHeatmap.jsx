
import YearHeatmap from "./YearHeatmap";

export default function CommitHeatmap({commitData}) {

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
        {commitData.map((yearData, i)=>{
          return <YearHeatmap key={i} yearData={yearData}/>
        })}
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
