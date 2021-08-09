require('canvas')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { Image } = require('canvas')


module.exports.PixelIt = class PixelIt {
  constructor (config) {
    const { document } = (new JSDOM(`<canvas id="pixelitcanvas"></canvas>`)).window;
    
    this.document = document
    this.drawTo = this.document.getElementById("pixelitcanvas")
    this.drawFrom = new Image()
    this.drawFrom.src = config.from
    this.scale =
      config.scale && config.scale > 0 && config.scale <= 50
        ? config.scale * 0.01
        : 8 * 0.01;
    this.palette = config.palette || [
      [0, 0, 0],
      [255, 255, 255]
    ]
    this.maxHeight = config.maxHeight
    this.maxWidth = config.maxWidth
    this.ctx = this.drawTo.getContext("2d");
  }

  colorSim(rgbColor, compareColor) {
    let i;
    let max;
    let d = 0;
    for (i = 0, max = rgbColor.length; i < max; i++) {
      d += (rgbColor[i] - compareColor[i]) * (rgbColor[i] - compareColor[i]);
    }
    return Math.sqrt(d);
  }

  similarColor(actualColor) {
    let selectedColor = [];
    let currentSim = this.colorSim(actualColor, this.palette[0]);
    this.palette.forEach((color) => {
      if (this.colorSim(actualColor, color) <= currentSim) {
        selectedColor = color;
        currentSim = this.colorSim(actualColor, color);
      }
    });
    return selectedColor;
  }

  pixelate() {
    this.draw()

    this.drawTo.width = this.drawFrom.naturalWidth;
    this.drawTo.height = this.drawFrom.naturalHeight;

    let scaledW = this.drawTo.width * this.scale;
    let scaledH = this.drawTo.height * this.scale;

    const tempCanvas = this.document.createElement("canvas");

    if(this.drawTo.width > 800 || this.drawTo.width > 800 ){
      this.scale *= 0.25;
      scaledW = this.drawTo.width * this.scale;
      scaledH = this.drawTo.height * this.scale;
      
      tempCanvas.width = Math.max(scaledW, scaledH) + 50;
      tempCanvas.height = Math.max(scaledW, scaledH) + 50;
    }

    const tempContext = tempCanvas.getContext("2d");
    
    tempContext.drawImage(this.drawFrom, 0, 0, scaledW, scaledH);
    this.document.body.appendChild(tempCanvas);

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      this.drawFrom.naturalWidth,
      this.drawFrom.naturalHeight
    );
    
    tempCanvas.remove();
    
    
    this.convertPalette()

    return this.drawTo
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  }

  convertPalette() {
    const w = this.drawTo.width;
    const h = this.drawTo.height;
    var imgPixels = this.ctx.getImageData(0, 0, w, h);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = y * 4 * imgPixels.width + x * 4;
        const finalcolor = this.similarColor([
          imgPixels.data[i],
          imgPixels.data[i + 1],
          imgPixels.data[i + 2],
        ]);
        imgPixels.data[i] = finalcolor[0];
        imgPixels.data[i + 1] = finalcolor[1];
        imgPixels.data[i + 2] = finalcolor[2];
      }
    }
    this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return this;
  }

  draw() {
    this.drawTo.width = this.drawFrom.width;
    this.drawTo.height = this.drawFrom.height;
    this.ctx.drawImage(this.drawFrom, 0, 0);
    return this;
  }
}