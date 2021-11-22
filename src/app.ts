import dotenv from "dotenv-safe";
dotenv.config();

import express from "express";

import { root, series, schedule, auth } from "./controllers";
import { isAuthorized } from "./services/auth";

// Configure Express
const app = express();
const port = Number(process.env.API_PORT ?? 3000);

app.use(express.json());
app.set("json spaces", 2);
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", root);
app.use("/auth", auth);
app.use("/series", isAuthorized, series);
app.use("/schedule", isAuthorized, schedule);

// Listen
app.listen(port, () => {
  const banner =
    "              _____     __  __" +
    "\n /\\ |\\ |||\\/||_  |  /\\ |__)|__)" +
    "\n/--\\| \\|||  ||__ | /--\\| \\ | \\  ";
  const line = "\n" + "-".repeat(process.stdout.columns) + "\n";
  console.log(
    banner +
      line +
      `Animetarr server is listening on port ${port}
  with:
    Password: ${process.env.PASSWORD}
    Sonarr API Base URL : ${process.env.SONARR_API_BASE_URL}
    Sonarr Quality Profile: ${process.env.SONARR_QUALITY_PROFILE_ID}
    Sonarr Base Path: ${process.env.SONARR_BASE_PATH}
    Sonarr API Key: ${process.env.SONARR_API_KEY}
    TVDB API Key: ${process.env.TVDB_API_KEY}` +
      line
  );
});
