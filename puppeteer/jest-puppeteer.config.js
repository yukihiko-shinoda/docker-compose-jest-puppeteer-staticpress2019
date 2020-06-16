require('dotenv').config()
module.exports = {
  launch: {
    defaultViewport: null,
    headless: (process.env.HEADLESS === undefined || process.env.HEADLESS == 'true'),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
  },
}
