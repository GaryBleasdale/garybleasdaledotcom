import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import '@astrojs/db/dist/runtime/virtual.js';

const db = await createRemoteDatabaseClient({
  dbType: "libsql",
  remoteUrl: "libsql://commitgraph-garymbleasdale.aws-us-east-1.turso.io",
  appToken: process.env.ASTRO_DB_APP_TOKEN ?? "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDU4NjQyMDIsImlkIjoiMWJlMWRkNjUtMGY5MS00YTZjLTg4NDItODE5ZGU0ZTdhYjI5IiwicmlkIjoiNTUyMmUyZGQtMjhiYi00ZTQ1LThkNjktMDYxMjdkMjY2OTQ5In0.nBtJta-6mUgGCuaY9nDZPAQEMKSoYA4vPW_gxfH5Av8T17JyTcueb7AM9dJHWWZwiPJ87a0dkTmyLYOwmEj1BA"
});
const commits = asDrizzleTable("commits", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "commits", "primaryKey": true } }, "repo_name": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "repo_name", "collection": "commits", "primaryKey": false, "optional": false } }, "commit_timestamp": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "commit_timestamp", "collection": "commits", "primaryKey": false, "optional": false } }, "commit_hash": { "type": "text", "schema": { "unique": true, "deprecated": false, "name": "commit_hash", "collection": "commits", "primaryKey": false, "optional": false } }, "author": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "author", "collection": "commits", "primaryKey": false, "optional": false } } }, "indexes": { "commits_commit_timestamp_idx": { "on": ["commit_timestamp"] } }, "deprecated": false }, false);

export { commits as c, db as d };
