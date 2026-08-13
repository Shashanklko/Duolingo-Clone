const fs = require('fs');
const https = require('https');

const urls = [
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/a50e95b2b4e8c91d610b9c7318389c1e.svg",
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/08ec8d0260c55c054e1b97bcbc96ea0f.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/2b077d42185bc45d4896ed55f15c4fea.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/2880099b038848abbfd11104097953ad.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/27d253ae1272917fc9f4a79459aacd53.svg",
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/23ab11cb1e1a9aff54facdf57833373d.svg",
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/22fce01f6df43e0472d7585afad9a43a.svg",
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/229d5f88cc9df2eb0b68f39466500911.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/112e1531d0ac198a9424bd1b0a7166e6.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/09eba3135efe8fe93a4662dba813b921.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/f818f545a703ddaa046ca8786e781742.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/f7cee6cc09270371b097129faf792c2a.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/f773f1b240623072e48843ecdf90d756.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/f578430c9b7ab617c107893afbb501c0.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/f095084e6ec400e631d62c3d95fefaa2.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/ef0bfb96037b127473bd7bcbfde1a6ed.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/edea4fa18ff3e7d8c0282de3f102aaed.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/ec5835ac9f465ff3dad4b1b8725d4314.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/eadd7804652170c33814a89482f1f353.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/de945d789e249dcd74333a6996472ef8.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/c8bad7c09aaf7bc29ddddc50808adb54.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/c71db846ffab7e0a74bc6971e34ad82e.svg",
"https://d35aaqx5ub95lt.cloudfront.net/images/splash/c6eae48dd48246c89e415b89f9e55282.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/bc80a9518cd6d5af6ae14e8b22b8a1f4.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/bbe17e16aa4a106032d8e3521eaed13e.svg",
"https://d35aaqx5ub95lt.cloudfront.net/vendor/bbc8ad0cfe2596d5193376ebdc3e969c.svg"
];

async function fetchSvg(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const data = await fetchSvg(url);
    const idMatch = data.match(/id="([^"]+)"/);
    const lottieMatch = url.includes("lottie") ? "[Lottie]" : "";
    const size = (data.length / 1024).toFixed(1) + "kb";
    const filename = url.split('/').pop();
    console.log(`[${i}] ${filename} ${lottieMatch} - Size: ${size} - ID: ${idMatch ? idMatch[1] : 'None'}`);
  }
}

main();
