// karma.conf.js
// process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    // browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: true,
    reporters: ['progress'],
    files:["src/spec/**.js"]
  });
};