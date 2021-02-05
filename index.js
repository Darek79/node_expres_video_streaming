/**================================================================================================
 **                                         VIDEO STREAM SKELETON
 *================================================================================================**/
//! PLEASE ADD a MP4 CLIP TO ASSETS FOLDER  

const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const server = require("http").createServer();
// const axios = require("axios");
const {promisify} = require("util");
const html = path.join(
  __dirname,
  "public",
  "index.html"
);
const video = path.join(
  __dirname,
  "public",
  "assets",
  "clip.mp4"
);

const express = require("express");
const app = express();

app.use(
  express.static(path.join(__dirname, "public"))
);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/video", async (req, res, next) => {
  console.log(req.params);
  const clip = path.join(
    __dirname,
    "public",
    "assets",
    "clip.mp4"
  );

  const {size} = await promisify(fs.stat)(clip);
  const range = req.headers.reange;
  const fileSize = size;
  if (range) {
    const parts = range
      .replace(/bytes=/, "")
      .split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(clip, {
      start,
      end,
    });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${filesize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    res.setHeader("Content-Length", fileSize);
    res.setHeader("Content-Type", "video/mp4");
    res.status(200);
    fs.createReadStream(clip).pipe(res);
  }
});

app.listen(8080, () =>
  console.log("server is up")
);
