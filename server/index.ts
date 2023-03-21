const express = require('express');
const Reddit = require('reddit')
const app = express();
const path = require('path');
const fs = require('fs') // Built-in filesystem package for Node.js
const get = require('get')
require('dotenv').config()

// Set the public folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));


function normalizePosts(post: {
  url: string,
  isVideo: boolean,
  link_flair_text: string,
  title: string,
  over_18: boolean
  id: string,
}, i: number) {
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

function imageDownloader(imageUrl: string, name: string){
  var dl = new get({ uri: imageUrl });
  //add video
  dl.toDisk(`./server/public/memes/${name}.png`, function(err, filename) {
    console.log(filename, err);
  });
  return dl;
}



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/video', async (req, res) => {

  const reddit = new Reddit({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    appId:  process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    userAgent: 'MoeCafe/1.0.0'
  })

  const posts = await reddit.get('/r/Animemes/top', {
    limit: 11,
    is_video: false,
    over_18: false
  })
  const filteredPosts = posts.data.children.filter(c => {
    return !c.data.is_video &&  !c.data.over_18
  });

  console.log(filteredPosts)
  res.send(shuffle(filteredPosts.map((c,i) => {
    console.log(i, imageDownloader(c.data.url, i));
    return normalizePosts(c.data, i)
  })).splice(0, 11))
})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));