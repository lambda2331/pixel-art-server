const express = require("express");
const bodyParser = require("body-parser");
const { PixelIt } = require("./pixel-it");
const app = express();
let port = process.env.PORT || 7000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

app.post("/generate-art", async (request, response) => {
  try {
    const { base64: from, palette, scale } = request.body
    const art = new PixelIt({ from, palette, scale })
    const pixerArt = art.pixelate()

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');  
    response.send({
      pixelArt: pixerArt
    })
  } catch (e) {
    console.log(e)
    response.send(e);
  }
});

app.listen(port, () => {
  console.log(`Exampler app in listening on port ${port}`);
});
