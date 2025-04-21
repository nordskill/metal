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

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'My Metalsmith Website',
      description: 'A simple website built with Metalsmith'
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
    // Mark the index.md file so it gets special permalink handling
    Object.keys(files).forEach(function (file) {
      if (path.basename(file, path.extname(file)) === 'index') {
        files[file].isIndex = true;
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
