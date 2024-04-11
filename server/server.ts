/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

type Entry = {
  entryId: number;
  userId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "entries"
    order by "entryId" desc;`;
    const result = await db.query<Entry>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!entryId || !Number.isInteger(+entryId)) {
      throw new ClientError(400, 'entryId required');
    }
    const sql = `
    select *
    from "entries"
    where "entryId" = $1;
    `;
    const params = [entryId];
    const result = await db.query<Entry>(sql, params);
    const entry = result.rows[0];
    if (!entry) {
      throw new Error(`entryId ${entryId} not found`);
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    const sql = `
    insert into "entries" ("title", "notes", "photoUrl")
    values ($1 ,$2 ,$3 )
    returning *;`;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, 'please enter title, notes, & photoUrl');
    }
    const params = [title, notes, photoUrl];
    const result = await db.query<Entry>(sql, params);
    const [newEntry] = result.rows;
    res.status(201).json(newEntry);
  } catch (err) {
    next(err);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId < 1) {
      throw new ClientError(400, 'entryId must be a positive integer');
    }
    const { title, notes, photoUrl } = req.body;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, 'please enter title, notes, & photoUrl');
    }
    const sql = `
    update "entries"
    set "title" = $1,
        "notes" = $2,
        "photoUrl" = $3
      where "entryId" = $4
      returning *;`;
    const params = [title, notes, photoUrl, entryId];
    const result = await db.query<Entry>(sql, params);
    const [updatedEntry] = result.rows;
    if (!updatedEntry) {
      throw new ClientError(404, `cannot find entry with ${entryId}`);
    }
    res.json(updatedEntry);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId < 1) {
      throw new ClientError(400, 'entryId must be a positive integer');
    }
    const sql = `
    delete from "entries"
        where "entryId" = $1
        returning *;`;
    const params = [entryId];
    const result = await db.query<Entry>(sql, params);
    const deletedEntry = result.rows[0];
    if (!deletedEntry)
      throw new ClientError(404, `entryId ${entryId} not found`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
