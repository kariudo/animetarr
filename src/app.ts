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
  console.log(`Animetarr server is listening on port ${port}`);
});
