const express = require('express');
const Reddit = require('reddit');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');

// Set the public folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));

function normalizePosts(post, i) {
  return {
    image: `data:${post.preview.images[0].resolutions[3].url.split('.').pop()};base64,${post.preview.images[0].source.data}`,
    id: post.id,
    title: post.title,
  };
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/video', async (req, res) => {
  try {
    const posts = await fetch("https://www.reddit.com/r/programming/top.json?t=week&limit=10&is_video=false&over_18=false")
      .then((response) => response.json())
      .catch((error) => console.error(error));
    const filteredPosts = posts.data.children.filter(c => {
      return !c.data.is_video && !c.data.over_18
    });
    const nextPosts = shuffle(filteredPosts.map((c, i) => {
      return normalizePosts(c.data, i)
    }).splice(0, 11));
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
