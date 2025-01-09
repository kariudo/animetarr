import express from "express";

import { GetAllSeries, GetAllSeriesId, PostSeries } from "../services/sonarr";

export const series = express.Router();

// GET /series/ids
series.get("/ids", async (req, res) => { res.json(await GetAllSeriesId()) });

// GET /series
series.get("/", async (req, res) => { res.json(await GetAllSeries()) });

// POST /series
series.post("/", async (req, res) => {
  const newSeriesId = req.body.tvdbId;
  const newSeries = await PostSeries(newSeriesId);
  res.json(newSeries);
});
