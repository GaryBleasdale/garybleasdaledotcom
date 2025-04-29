import { commits, db } from "astro:db";
import { commitsData } from "./seed-data";

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(commits).values(commitsData);
}
