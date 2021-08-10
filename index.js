const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const { PixelIt } = require("./pixel-it");
const app = express();
let port = process.env.PORT || 7000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

app.post("/generate-art", cors(), async (request, response) => {
  try {
    const { base64: from, palette, scale } = request.body
    const art = new PixelIt({ from, palette, scale })
    const pixerArt = art.pixelate()
    console.log(pixerArt)
    response.send({
      pixelArt: pixerArt
    })
  } catch (e) {
    response.send(e);
  }
});

app.listen(port, () => {
  console.log(`Exampler app in listening on port ${port}`);
});
