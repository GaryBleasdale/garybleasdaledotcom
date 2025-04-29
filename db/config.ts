import { column, defineDb, defineTable } from "astro:db";

const commits = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    repo_name: column.text(),
    commit_timestamp: column.number(),
    commit_hash: column.text({ unique: true }),
    author: column.text(),
  },
  indexes: [
    { on: ["commit_timestamp"] },
  ],
});

export default defineDb({
  tables: { commits },
});
