import express from "express";

export const auth = express.Router();

// POST /auth
auth.post("/", async (req, res) => {
  const password = req.body.password;
  res.json(process.env.password == password);
});
