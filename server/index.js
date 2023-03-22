const express = require('express');
const Reddit = require('reddit')
const app = express();
const path = require('path');
const fs = require('fs')

// Set the public folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));


function normalizePosts(post, i) {
  return {
    oldImage: post.url,
    image: `/memes/${i}.png`,
    id: post.id,
    title: post.title,
  }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function imageDownloader(imageUrl, name) {
  const url =imageUrl;
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(`./server/public${name}`, buffer, console.log);
  return `./server/public${name}`;
}



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/save', express.raw({type: "*/*", limit: '200mb'}), (req, res) => {
  const blobData = req.body; // assuming the blob data is sent in the request body
  const filename = 'canvas-made.webm'; // specify a filename for the saved blob
  // use fs.writeFile to save the blob data to a file
  fs.writeFile(filename, blobData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving blob to file');
    } else {
      res.status(200).send('Blob saved successfully');
    }
  });
});

app.get('/video', async (req, res) => {
  try {
    
const posts = await fetch("https://www.reddit.com/r/programming/top.json?t=week")
  .then((response) => response.json())
  .catch((error) => console.error(error));
    const filteredPosts = posts.data.children.filter(c => {
      return !c.data.is_video && !c.data.over_18
    });
    const nextPosts = shuffle(filteredPosts.map((c, i) => {
      return normalizePosts(c.data, i)
    }).splice(0, 11));

    const getImages = await Promise.all(nextPosts.map(p => {
      return imageDownloader(p.oldImage, p.image);
    }))
    console.log(getImages)
    res.send(nextPosts)
  } catch (err) {
    console.error(err);
    res.send([
      {
        image: `https://placehold.co/600x400?text=Reddit+failed`,
        id: new Date().toISOString(),
        title: 'failed to call reddit',
      }
    ])
  }
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
