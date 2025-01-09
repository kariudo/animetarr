import express from "express";
import { version as v } from "../../package.json";
export const version = express.Router();

// GET /version
version.get("/", (_req, res) => { res.json(v) });
