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
// This is for linking within the site, not for file structure
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
  // Modify permalinks to work correctly without creating a metal subdirectory
  .use(permalinks({
    relative: false,
    pattern: ':title',
    linksets: [{
      match: { permalink: ':permalink' },
      pattern: ':permalink'
    }]
  }))
  .use(function (files, metalsmith, done) {
    // Modify permalinks but ensure files are created at the right place
    Object.keys(files).forEach(function (file) {
      const data = files[file];

      // Special handling for index file
      if (path.basename(file, path.extname(file)) === 'index') {
        data.isIndex = true;
        data.permalink = '/'; // Place index.html at the root level

        // No changes needed to path - we want it at build/index.html
      } else {
        // For other files, keep them in their respective folders
        if (data.permalink && data.permalink !== '/') {
          // Don't add basePath to permalinks for file paths
          // This ensures files go to build/about/ etc. instead of build/metal/about/
        }
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
