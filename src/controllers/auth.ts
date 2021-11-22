import express from "express";

export const auth = express.Router();

// POST /auth
auth.post("/", async (req, res) => {
  const password = req.body.password;
  const valid = process.env.PASSWORD == password;
  console.log(
    `${new Date(Date.now()).toLocaleString()}: Authentication ${
      valid ? "success. " : "failed, attempted with: " + password
    }`
  );
  res.json(valid);
});
