import { column, defineDb, defineTable } from "astro:db";

const years = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    year: column.text(),
  },
});

const year2025 = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    date: column.text(),
    value: column.number(),
    author: column.text(),
  },
});

const year2024 = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    date: column.text(),
    value: column.number(),
    author: column.text(),
  },
});

const year2023 = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    date: column.text(),
    value: column.number(),
    author: column.text(),
  },
});

export default defineDb({
  tables: { year2025, year2024, year2023, years },
});
