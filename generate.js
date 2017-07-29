const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const minify = require('html-minifier').minify;
const showdown = require('showdown');
const fsExtra = require('fs-extra');

const BUILD_DIR = require('./config').BUILD_DIR;

const readPostConfigFromFile = postDirectoryName => {
  const configFilePath = path.join(__dirname, 'data', postDirectoryName, 'config.json');
  return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
};

const getCanonicalPostUrl = (websiteConfig, postConfig) => (
  `${websiteConfig.url}${path.join(postConfig.slug, '/')}`
);

const readWebsiteConfigFromFile = () => {
  const configFilePath = path.join(__dirname, 'data/config.json');
  return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
};

const getListOfDirectoriesInDataDirectory = () => {
  const dataDirectoryPath = path.join(__dirname, 'data');
  const fileNames = fs.readdirSync(dataDirectoryPath, 'utf8');
  const directoryNames = fileNames
  .filter(fileName => (
    fs.statSync(path.join(dataDirectoryPath, fileName)).isDirectory()
  ));

  return directoryNames;
};

const getListOfPostsInDataDirectory = () => {
  const dataDirectoryPath = path.join(__dirname, 'data');
  const fileNames = fs.readdirSync(dataDirectoryPath, 'utf8');
  const posts = fileNames
              .filter(fileName => (
                fs.statSync(path.join(dataDirectoryPath, fileName)).isDirectory()
              ))
              .map(readPostConfigFromFile)
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                if (dateA < dateB) {
                  return 1;
                }

                if (dateA > dateB) {
                  return -1;
                }

                return 0;
              });

  return posts;
};

const convertMarkdownToHtml = markdown => {
  const converter = new showdown.Converter({
    noHeaderId: true,
  });

  return converter.makeHtml(markdown);
};

const readMarkdownFromFile = markdownFilePath => (
  fs.readFileSync(markdownFilePath, 'utf8')
);

const getPostBuildDirectoryPath = postConfig => (
  path.join(__dirname, BUILD_DIR, postConfig.slug)
);

const createPostHtmlFile = (postHtmlContent, postConfig) => {
  const directoryPath = getPostBuildDirectoryPath(postConfig);
  const htmlFilePath = path.join(__dirname, BUILD_DIR, postConfig.slug, 'index.html');

  mkdirp.sync(directoryPath);

  // https://github.com/mde/ejs/issues/124
  const templateFilePath = path.join(__dirname, 'source/templates/post/index.ejs');

  const compiled = ejs.compile(fs.readFileSync(templateFilePath, 'utf8'), {
    filename: templateFilePath,
  });

  const websiteConfig = readWebsiteConfigFromFile();

  let htmlContent = compiled({
    websiteName: websiteConfig.name,
    websiteDescription: websiteConfig.description,
    showHomeLink: true,
    postHtml: postHtmlContent,
    postTitle: postConfig.title,
    postDescription: postConfig.description,
    postSlug: postConfig.slug,
    googleAnalyticsTrackingId: websiteConfig.googleAnalyticsTrackingId,
    addThisPubId: websiteConfig.addThisPubId,
    canonicalPostUrl: getCanonicalPostUrl(websiteConfig, postConfig),
  });

  htmlContent = minify(htmlContent, {
    collapseWhitespace: true,
  });

  fs.writeFileSync(htmlFilePath, htmlContent);
};

const copyPostImagesToBuild = postConfig => {
  const postImagesDirectory = path.join(__dirname, 'data', postConfig.slug, 'images');

  fs.stat(postImagesDirectory, error => {
    if (!error) {
      const buildPostImagesDirectory = path.join(getPostBuildDirectoryPath(postConfig), 'images/');
      fsExtra.copySync(postImagesDirectory, buildPostImagesDirectory);
    }
  });
};

const createPost = postDirectoryName => {
  const postConfig = readPostConfigFromFile(postDirectoryName);
  const contentFilePath = path.join(__dirname, 'data', postConfig.slug, 'content.md');
  const postMarkdown = readMarkdownFromFile(contentFilePath);
  const postHtml = convertMarkdownToHtml(postMarkdown);

  console.log(`💡 Creating: ${postConfig.title}`); // eslint-disable-line no-console

  createPostHtmlFile(postHtml, postConfig);
  copyPostImagesToBuild(postConfig);
};

const createPosts = () => (
  getListOfDirectoriesInDataDirectory().forEach(createPost)
);

const createHomePage = () => {
  const htmlFilePath = path.join(__dirname, `${BUILD_DIR}/index.html`);

  // https://github.com/mde/ejs/issues/124
  const templateFilePath = path.join(__dirname, 'source/templates/home/index.ejs');

  const compiled = ejs.compile(fs.readFileSync(templateFilePath, 'utf8'), {
    filename: templateFilePath,
  });

  const posts = getListOfPostsInDataDirectory();

  const websiteConfig = readWebsiteConfigFromFile();

  let htmlContent = compiled({
    websiteName: websiteConfig.name,
    websiteDescription: websiteConfig.description,
    posts,
    showHomeLink: false,
    googleAnalyticsTrackingId: websiteConfig.googleAnalyticsTrackingId,
  });

  htmlContent = minify(htmlContent, {
    collapseWhitespace: true,
  });

  fs.writeFileSync(htmlFilePath, htmlContent);
};

createPosts();
createHomePage();

console.log('🏁  Finished.'); // eslint-disable-line no-console
