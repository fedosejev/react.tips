const fs = require("fs");
const path = require("path");
const sitemap = require("sitemap");
const BUILD_DIR = require("./build-config").BUILD_DIR;
const URL = require("./build-config").WEBSITE_URL;

const getListOfDirectoriesInDataDirectory = () => {
  const dataDirectoryPath = path.join(__dirname, "data");
  const fileNames = fs.readdirSync(dataDirectoryPath, "utf8");
  const directoryNames = fileNames.filter(fileName =>
    fs.statSync(path.join(dataDirectoryPath, fileName)).isDirectory()
  );

  return directoryNames;
};

const generateSitemapFile = () => {
  const outputFile = path.join(__dirname, `./${BUILD_DIR}/sitemap.xml`);
  const tutorials = getListOfDirectoriesInDataDirectory();
  const rootUrl = {
    url: "/",
    changefreq: "weekly",
    priority: 0.8,
    lastmodrealtime: true,
    lastmodfile: path.join(__dirname, `/${BUILD_DIR}/index.html`)
  };

  const urls = tutorials.map(tutorial => ({
    url: `/${tutorial}`,
    changefreq: "monthly",
    priority: 0.8,
    lastmodrealtime: true,
    lastmodfile: path.join(__dirname, `/${BUILD_DIR}/${tutorial}/index.html`)
  }));

  urls.unshift(rootUrl);

  const theSitemap = sitemap.createSitemap({
    hostname: URL,
    cacheTime: 600000, // 600 sec (10 min) cache purge period
    urls
  });

  fs.writeFileSync(outputFile, theSitemap.toString());
};

const generateRobotsFile = () => {
  const robotsFileContent = `User-agent: * \n\nDisallow: \n\nSitemap: ${URL}/sitemap.xml`;
  const filePath = path.join(__dirname, `/${BUILD_DIR}/robots.txt`);

  fs.writeFileSync(filePath, robotsFileContent);
};

const generate = () => {
  generateSitemapFile();
  generateRobotsFile();
};

module.exports = {
  generate
};

generate();
