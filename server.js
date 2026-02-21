import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 8080;
const dist = path.resolve(process.cwd(), "dist");

app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(port, () => console.log(`Listening on ${port}`));
