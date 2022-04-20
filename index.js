import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv"
import airdrop from "./src/apis/airdrop.js";
import file from "./src/apis/file.js";

config();

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("welcome!")
})

app.get('/api', (req, res) => res.send('Api is ready'));

app.use("/api/file", file);
app.use("/api/airdrop", airdrop);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;