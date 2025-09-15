import express from "express";
import { postsRoutes } from "./routes/posts.js";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());
postsRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

export { app };
