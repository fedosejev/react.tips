var fs = require('fs');
var ejs = require('ejs');
var mkdirp = require('mkdirp');
var minify = require('html-minifier').minify;
var showdown = require('showdown');
var fsExtra = require('fs-extra');

function getListOfDirectoriesInDataDirectory() {
  var dataDirectoryPath = __dirname + '/data/';
  var fileNames = fs.readdirSync(dataDirectoryPath, 'utf8');
  var directoryNames = fileNames.filter(function (fileName) {
    return fs.statSync(dataDirectoryPath + fileName).isDirectory();
  });

  return directoryNames;
}

function getListOfPostsInDataDirectory() {
  var dataDirectoryPath = __dirname + '/data/';
  var fileNames = fs.readdirSync(dataDirectoryPath, 'utf8');
  var posts = fileNames
              .filter(function (fileName) {
                return fs.statSync(dataDirectoryPath + fileName).isDirectory();
              })
              .map(function (directoryName) {
                return readPostConfigFromFile(directoryName);
              });

  return posts;
}

function convertMarkdownToHtml(markdown) {
  var converter = new showdown.Converter({
    noHeaderId: true
  });
  
  return converter.makeHtml(markdown);
}

function readMarkdownFromFile(markdownFilePath) {
  return fs.readFileSync(markdownFilePath, 'utf8');
}

function getPostBuildDirectoryPath(postConfig) {
  return __dirname + '/build/' + postConfig.slug;
}

function createPostHtmlFile(postHtmlContent, postConfig) {
  var directoryPath = getPostBuildDirectoryPath(postConfig);
  var htmlFilePath = __dirname + '/build/' + postConfig.slug + '/index.html';

  mkdirp.sync(directoryPath);

  // https://github.com/mde/ejs/issues/124
  var templateFilePath = __dirname + '/source/templates/post/index.ejs';

  var compiled = ejs.compile(fs.readFileSync(templateFilePath, 'utf8'), {
    filename: templateFilePath
  });

  var websiteConfig = readWebsiteConfigFromFile();

  var htmlContent = compiled({
    websiteName: websiteConfig.name,
    websiteDescription: websiteConfig.description,
    postHtml: postHtmlContent,
    postTitle: postConfig.title,
    postDescription: postConfig.description,
    postSlug: postConfig.slug,
    googleAnalyticsTrackingId: websiteConfig.googleAnalyticsTrackingId,
    addThisPubId: websiteConfig.addThisPubId,
    canonicalPostUrl: getCanonicalPostUrl(websiteConfig, postConfig)
  });

  htmlContent = minify(htmlContent, {
    collapseWhitespace: true
  });

  fs.writeFileSync(htmlFilePath, htmlContent);
}

function readPostConfigFromFile(postDirectoryName) {
  var configFilePath = __dirname + '/data/' + postDirectoryName + '/config.json';
  return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
}

function readWebsiteConfigFromFile() {
  var configFilePath = __dirname + '/data/config.json';
  return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
}

function copyPostImagesToBuild(postConfig) {
  var postImagesDirectory = __dirname + '/data/' + postConfig.slug + '/images/';

  fs.stat(postImagesDirectory, function (error, stats) {
    if (! error) {
      var buildPostImagesDirectory = getPostBuildDirectoryPath(postConfig) + '/images/';
      fsExtra.copySync(postImagesDirectory, buildPostImagesDirectory);
    }
  });
}

function getCanonicalPostUrl(websiteConfig, postConfig) {
  return websiteConfig.url + postConfig.slug + '/';
}

function createPost(postDirectoryName) {
  var postConfig = readPostConfigFromFile(postDirectoryName);
  var contentFilePath = __dirname + '/data/' + postConfig.slug + '/content.md';
  var postMarkdown = readMarkdownFromFile(contentFilePath);
  var postHtml = convertMarkdownToHtml(postMarkdown);

  console.log('Creating web page for post: ' + postConfig.title);

  createPostHtmlFile(postHtml, postConfig);
  copyPostImagesToBuild(postConfig);
}

function createPosts() {
  getListOfDirectoriesInDataDirectory().forEach(createPost);
}

function createLandingPage() {
  var htmlFilePath = __dirname + '/build/index.html';

  // https://github.com/mde/ejs/issues/124
  var templateFilePath = __dirname + '/source/templates/landing/index.ejs';

  var compiled = ejs.compile(fs.readFileSync(templateFilePath, 'utf8'), {
    filename: templateFilePath
  });

  var posts = getListOfPostsInDataDirectory();

  var websiteConfig = readWebsiteConfigFromFile();

  var htmlContent = compiled({
    websiteName: websiteConfig.name,
    websiteDescription: websiteConfig.description,
    posts: posts,
    googleAnalyticsTrackingId: websiteConfig.googleAnalyticsTrackingId
  });

  htmlContent = minify(htmlContent, {
    collapseWhitespace: true
  });

  fs.writeFileSync(htmlFilePath, htmlContent);
}

createPosts();
createLandingPage();

console.log('🏁');
