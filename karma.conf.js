// karma.conf.js
// process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    customLaunchers: {
      Headless_Chrome: {
        base: "Chrome",
        flags: ["--no-sandbox", "--disable-gpu"],
      },
    },
    singleRun: true,
    autoWatch: true,
    reporters: ['progress'],
    files:["src/spec/**.js"]
  });
};