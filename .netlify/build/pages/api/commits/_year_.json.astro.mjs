import { c as commits, d as db } from '../../../chunks/_astro_db_GhweK_FF.mjs';
import { sql, and, gte, lt } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const yearParam = params.year;
  if (!yearParam) {
    return new Response(
      JSON.stringify({ message: "Missing year parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  const year = parseInt(yearParam, 10);
  if (isNaN(year) || year < 1970 || year > 2100) {
    return new Response(
      JSON.stringify({ message: "Invalid year parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    let convertTimestampToDate = function(timestamp) {
      const date = new Date(timestamp * 1e3);
      return date.toISOString();
    };
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const startTimestamp = Math.floor(startOfYear.getTime() / 1e3);
    const endTimestamp = Math.floor(startOfNextYear.getTime() / 1e3);
    const dayTimestampExpression = sql`CAST(strftime('%s', DATE(${commits.commit_timestamp}, 'unixepoch')) AS INTEGER)`;
    const commitRows = await db.select({
      dayTimestamp: dayTimestampExpression,
      commitCount: sql`COUNT(*)`
    }).from(commits).where(and(
      gte(commits.commit_timestamp, startTimestamp),
      lt(commits.commit_timestamp, endTimestamp)
    )).groupBy(dayTimestampExpression).orderBy(dayTimestampExpression);
    const commitsDataForHeatmap = commitRows.map((datum) => {
      return {
        date: convertTimestampToDate(datum.dayTimestamp),
        value: datum.commitCount
      };
    });
    return new Response(JSON.stringify(commitsDataForHeatmap), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Error fetching commit data for year ${year}:`, error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
function getStaticPaths() {
  return [
    { params: { year: "2025" } },
    { params: { year: "2024" } },
    { params: { year: "2023" } },
    { params: { year: "2022" } },
    { params: { year: "2021" } }
  ];
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    getStaticPaths,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
