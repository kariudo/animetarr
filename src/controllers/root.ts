import express from "express";
import { join } from "path";
import { existsSync } from "fs";

export const root = express.Router();

let uiPath: string;

// Find the path to the UI directory output, varies in development vs compiled via ncc.
const inRootDir = join(process.cwd(), "/ui");
const inDistDir = join(process.cwd(), "/dist", "/ui");

if (existsSync(inRootDir)) {
  uiPath = inRootDir;
} else if (existsSync(inDistDir)) {
  uiPath = inDistDir;
} else {
  throw new Error("Unable to find UI path. Did you run 'ng build' for the UI?");
}

// Use static files middleware.
root.use(express.static(uiPath));

// GET / - Serve the root as the static index.html, keeps us from needing to have 'api' in our routes.
root.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/ui/index.html"));
});
