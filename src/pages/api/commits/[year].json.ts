export const prerender = false;
import type { APIRoute } from "astro";
import { and, commits, db, gte, lt, sql } from "astro:db";

export const GET: APIRoute = async ({ params }) => {
    const yearParam = params.year;

    if (!yearParam) {
        return new Response(
            JSON.stringify({ message: "Missing year parameter" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const year = parseInt(yearParam, 10);

    if (isNaN(year) || year < 1970 || year > 2100) {
        return new Response(
            JSON.stringify({ message: "Invalid year parameter" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    try {
        const startOfYear = new Date(year, 0, 1);
        const startOfNextYear = new Date(year + 1, 0, 1);

        const startTimestamp = Math.floor(startOfYear.getTime() / 1000);
        const endTimestamp = Math.floor(startOfNextYear.getTime() / 1000);

        const dayTimestampExpression = sql<
            number
        >`CAST(strftime('%s', DATE(${commits.commit_timestamp}, 'unixepoch')) AS INTEGER)`;
        function convertTimestampToDate(timestamp: number) {
            const date = new Date(timestamp * 1000);
            return date.toISOString();
        }

        const commitRows = await db.select({
            dayTimestamp: dayTimestampExpression,
            commitCount: sql<number>`COUNT(*)`,
        })
            .from(commits)
            .where(and(
                gte(commits.commit_timestamp, startTimestamp),
                lt(commits.commit_timestamp, endTimestamp),
            ))
            .groupBy(dayTimestampExpression)
            .orderBy(dayTimestampExpression);

        const commitsDataForHeatmap = commitRows.map((datum) => {
            return {
                date: convertTimestampToDate(datum.dayTimestamp),
                value: datum.commitCount,
            };
        });

        return new Response(JSON.stringify(commitsDataForHeatmap), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error(`Error fetching commit data for year ${year}:`, error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
};
