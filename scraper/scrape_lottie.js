const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const lottieDir = path.join(__dirname, '..', 'client', 'public', 'lottie');
  if (!fs.existsSync(lottieDir)) {
    fs.mkdirSync(lottieDir, { recursive: true });
  }

  page.on('response', async (response) => {
    const url = response.url();
    // Duolingo's lottie files usually end with .json and contain 'lottie' in the path
    if (url.includes('.json') && url.includes('lottie')) {
      console.log('Found Lottie JSON:', url);
      try {
        const buffer = await response.buffer();
        const filename = path.basename(url);
        fs.writeFileSync(path.join(lottieDir, filename), buffer);
        console.log('Saved', filename);
      } catch (e) {
        console.error('Failed to save', url, e.message);
      }
    }
  });

  console.log('Navigating to duolingo.com...');
  await page.goto('https://www.duolingo.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('Finished scraping!');
  await browser.close();
})();
