// Express server
const express = require("express");
const { createToken } = require("./auth");
const { createUser, findUserByEmail } = require("./database");

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "Email taken" });
  }
  const user = createUser(email, password);
  const token = createToken(user);
  res.json({ user: { id: user.id, email: user.email }, token });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = createToken(user);
  res.json({ token });
});

app.listen(3000, () => console.log("Server running on port 3000"));
