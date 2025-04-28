import { db, year2023, year2024, year2025 } from "astro:db";
import { year2023Data, year2024Data, year2025Data } from "./seed-data";

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(year2025).values(year2025Data);

	await db.insert(year2024).values(year2024Data);

	await db.insert(year2023).values(year2023Data);
}
