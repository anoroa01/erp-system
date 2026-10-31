require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("node:dns");

const connectDatabase = require("./config/database");
const appRouter = require("./routes/router");

const app = express();
const PORT = process.env.PORT || 8000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(cors());
app.use(express.json());
app.use(appRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("ERP System API");
});

const boot = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

boot();
