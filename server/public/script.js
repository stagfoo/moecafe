var f = new FontFace('title', 'url(/font.ttf)');
let posts = [];
const canvas = document.getElementById("record-canvas");
const ctx = canvas.getContext("2d");
const totalVideoLength = (60 * 1000) * 1.2
let tick;
// Set the current image index to 0
let currentImageIndex = 0;
let hasStarted = false;



function startSlideshow(){
  animate();
  setTimeout(() => {
    setInterval(() => {
      next()
    }, totalVideoLength/posts.length)
    recordCanvas(canvas, totalVideoLength);
    hasStarted = true
  }, 0)
}



f.load().then(function(font) {

  // Ready to use the font in a canvas context
  console.log('font ready');

  // Add font on the html page
  document.fonts.add(font);

  ctx.font = "50px title";
});


function createCenteredImage(ctx, id, y) {
  var img = document.getElementById(id);
  ctx.drawImage(img, (1080 - img.width) / 2, y, img.width, img.height);

}

function normalizeTitle(s){
  const threshold = 30;
  let trunk = s.substr(0, threshold)
  if(s.length > threshold){
    trunk = trunk + "..."
  }
  return trunk
}



// Define the animation loop function
function animate() {
  // Clear the canvas

  // Draw the current image on the canvas
  if(posts[currentImageIndex]) {
    const image = new Image();
    image.onload = function () {
      // Calculate the scaling factor for the image
      const canFac = 1.2
      const scaleFactor = Math.min((canvas.width/canFac) / image.width, (canvas.height/canFac) / image.height);

      // Calculate the centered position for the image
      const dx = (canvas.width - image.width * scaleFactor) / 2;
      const dy = (canvas.height - image.height * scaleFactor) / 2;
      const finalWidth = image.width * scaleFactor;
      const finalHeight = image.height * scaleFactor;

      // Draw the scaled and centered image on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      createCenteredImage(ctx, 'bg', 0)
      ctx.fillStyle = "white"
      ctx.fillRect(dx, dy - 95, finalWidth, 100 );
      ctx.drawImage(image, dx, dy, finalWidth, finalHeight);
      ctx.fillStyle = "black"
      
      ctx.fillText(normalizeTitle(posts[currentImageIndex].title), dx+10, dy - 40); 
    };
    image.src = posts[currentImageIndex].image;
  }

  // Request the next frame of the animation
  requestAnimationFrame(animate);

}

function next() {
  currentImageIndex++;
  if (currentImageIndex >= posts.length) {
    clearInterval(tick);
  }
}

async function startVideo(){
  let result;
  try {
    posts = await fetch("/video").then((response) => {
      document.body.querySelector('#console').innerHTML = `<h1>complete</h1>`
      return response.json()
    })
    startSlideshow()
    result = posts;
    return result;
  } catch(err) {
    document.body.querySelector('#console').innerHTML = `<h2>failed</h2>`
    console.error('err', err)
    result = err
  }
}


function recordCanvas(canvas, videoLength) {
  const recordedChunks = [];
  const recordedStream = new MediaStream(canvas.captureStream(25))
  const mediaRecorder = new MediaRecorder(recordedStream, {
    mimeType: "video/webm; codecs=vp9",
  });
  mediaRecorder.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  }
  mediaRecorder.onstop = () => {
    const url = URL.createObjectURL(
      new Blob(recordedChunks, { type: "video/webm" })
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "canvas-made.webm";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  mediaRecorder.start();
  window.setTimeout(() => {
    mediaRecorder.stop();
  }, videoLength);
}

