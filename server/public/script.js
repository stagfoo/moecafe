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
  }, 1000)
}


try {
  var f = new FontFace('title', 'url(/font.ttf)');
  f.load().then(function(font) {
    document.fonts.add(font);
    ctx.font = "50px title";
  });
} catch (err) {
  document.body.querySelector('#console').innerHTML = err.message
  console.error(err)
}


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
  if( posts[currentImageIndex]){
  // Draw the current image on the canvas
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

  // Request the next frame of the animation
  requestAnimationFrame(animate);
  }
}

function next() {
  currentImageIndex++;
  if (currentImageIndex >= posts.length) {
    clearInterval(tick);
    setTimeout(() => {
      document.body.querySelector('#console').innerHTML = `<div id="complete-video">( -3-)🎉</div>`
    }, 1000)
  }
  if(posts[currentImageIndex]){
    console.log('adding image', posts[currentImageIndex].image)
  }
}

async function fetchPosts(){
  posts = await fetch("/animemes.json").then((response) => {
    return response.json()
  })
}

async function startVideo(){
  let result;
  try {
    fetchPosts()
    startSlideshow()
    console.log('posts', posts)
    result = posts;
    return result;
  } catch(err) {
    console.error('err', err)
    document.body.querySelector('#console').innerHTML = err.message
    result = err
  }
}


function recordCanvas(canvas, videoLength) {
  try {
    const recordedChunks = [];
    const recordedStream = new MediaStream(canvas.captureStream(25))
    const mediaRecorder = new MediaRecorder(recordedStream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });
    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.push(event.data);
    }
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" })
      localStorage.setItem('video', videoBlob)
      fetch('/save', {
        method: "POST",
        body: videoBlob
      });
    };
    mediaRecorder.start();
    window.setTimeout(() => {
      mediaRecorder.stop();
    }, videoLength);
  } catch(err) {
    document.body.querySelector('#console').innerHTML = err.message
    console.log(err);
  }
}
