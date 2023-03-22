import { test, expect } from '@playwright/test';
import fs from 'fs';

const reddit = `animemes`
const jsonFile = `./server/public/${reddit}.json`;


async function fetchRedditInformation(){
  await fetch(`https://www.reddit.com/r/${reddit}/top.json?t=day&limit=15`)
  .then(response => response.json())
  .then(async data => {
    console.log('🍂 Fetching Memes')
    const posts = data.data.children.map(child => child.data);
    const normalizedPosts = posts.filter(p => p.post_hint === "image").map(post => { 
      return {
        title: post.title,
        url: post.url,
        image: `/${post.id}.png`,
        id: post.id,
      }
    })
  fs.writeFile(jsonFile, JSON.stringify(normalizedPosts), (err) => {
    if (err) throw err;
    console.log('🍱 Data saved to file');
  });
  await Promise.all(normalizedPosts.map(p => {
    return fetch(p.url).then(async (res) => {
      const blob = await res.blob();
      console.log('🍱 Saving Image', p.id);
      return fs.writeFileSync(`./server/public/${p.id}.png`, Buffer.from( await blob.arrayBuffer() ));
    })
  })).catch(error => console.error(error));
  })

  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const obj = JSON.parse(data);
      console.log('💖 JSON Found!');
      console.log(obj);
      expect(obj).toBeTruthy();
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  });
}


test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await fetchRedditInformation();
  page.on("console", (message) => {
    console.log(message);
  })
  await page.goto('http://localhost:3000');
  await page.waitForSelector("#record-canvas")
  await page.waitForSelector("#download-snippet")
  await page.evaluate(() => {
    console.log('💖 Fetching Meme JSON!');
    fetchPosts()
  })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    console.log('📺 Starting Video');
    startVideo()
  })
  await page.waitForSelector("#complete-video")
  await expect(page).toHaveTitle(/Moecafe/);
});
