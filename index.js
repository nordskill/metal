const Metalsmith = require('metalsmith');
const markdown = require('@metalsmith/markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('@metalsmith/permalinks');
const path = require('path');

// Get current date for footer
const now = new Date();
const currentDate = now.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Define base path for GitHub Pages
const basePath = '/metal';

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'My Metalsmith Website',
      description: 'A simple website built with Metalsmith',
      basePath: basePath
    },
    date: currentDate
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(markdown())
  .use(permalinks({
    relative: false,
    pattern: ':title',
    linksets: [{
      match: { permalink: ':permalink' },
      pattern: ':permalink'
    }]
  }))
  .use(function (files, metalsmith, done) {
    // Add base path to permalinks and handle index file
    Object.keys(files).forEach(function (file) {
      const data = files[file];

      // Handle index file specifically
      if (path.basename(file, path.extname(file)) === 'index') {
        data.isIndex = true;

        // Set correct permalink for index
        if (data.permalink === '/') {
          data.permalink = basePath + '/';
        }
      }

      // Ensure all permalinks have the correct base path
      if (data.permalink && !data.permalink.startsWith(basePath) && data.permalink !== '/') {
        data.permalink = path.join(basePath, data.permalink);
      }
    });
    done();
  })
  .use(layouts({
    engine: 'handlebars',
    directory: 'layouts',
    default: 'default.hbs'
  }))
  .build(function (err) {
    if (err) throw err;
    console.log('Build completed successfully!');
  });
