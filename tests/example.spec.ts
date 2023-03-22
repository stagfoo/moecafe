import { test, expect } from '@playwright/test';
import fs from 'fs';

const reddit = `animemes`
const jsonFile = `./server/public/${reddit}.json`;


async function fetchRedditInformation(){
  await fetch(`https://www.reddit.com/r/${reddit}/top.json?t=day&limit=15`)
  .then(response => response.json())
  .then(data => {
    const posts = data.data.children.map(child => child.data);
    const normalizedPosts = posts.filter(p => p.post_hint === "image").map(post => { 
      return {
        title: post.title,
        url: post.url,
        image: `/${post.id}.png`,
        id: post.id,
      }
    })
  Promise.all(normalizedPosts.map(p => {
    fetch(p.url).then(async (res) => {
      const blob = await res.blob();
      return fs.writeFileSync(`./server/public/${p.id}.png`, Buffer.from( await blob.arrayBuffer() ));
    })
  })).then(() => {
    fs.writeFile(jsonFile, JSON.stringify(normalizedPosts), (err) => {
      if (err) throw err;
      console.log('Data saved to file');
    });
  })
  .catch(error => console.error(error));
  })

  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const obj = JSON.parse(data);
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
    fetchPosts()
  })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    startVideo()
  })
  await page.waitForSelector("#complete-video")
  await expect(page).toHaveTitle(/Moecafe/);
});
