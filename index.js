const express = require("express");
const bodyParser = require("body-parser");
const { PixelIt } = require("./pixel-it");
const app = express();
let port = process.env.PORT || 7000;

app.use(bodyParser.json())

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

app.post("/generate-art", async (request, resolve) => {
  try {
    const { base64: from, palette, scale } = request.body
    const art = new PixelIt({ from, palette, scale })
    const pixerArt = art.pixelate()
    resolve.send({
      pixelArt: pixerArt
    })
  } catch (e) {
    resolve.send(e);
  }
});

app.listen(port, () => {
  console.log(`Exampler app in listening on port ${port}`);
});
