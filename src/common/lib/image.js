  //   resize('/images/image.jpg', 1024, 768, (canvas) => {
  //     console.log(canvas.toDataURL())
  //     //data:image/png;base64,iVBORw0...5CYII=
  //   })
export function resize(url, width, height, callback) {
  const sourceImage = new Image();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  sourceImage.onload = function() {
      const ctx = canvas.getContext("2d")
      ctx.drawImage(sourceImage, 0, 0, width, height);
      callback(canvas);
  }

  sourceImage.src = url;
}