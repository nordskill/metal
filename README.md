# Metalsmith Simple Website

A simple website built with Metalsmith that loads content from Markdown files and automatically deploys via GitHub Actions.

## Features

- Content from Markdown files in the `src` directory
- Simple and responsive design
- Clean URLs using permalinks
- Automatic deployment to GitHub Pages on commit

## Local Development

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

```bash
npm install
```

### Building the site

```bash
npm run build
```

The built site will be available in the `build` directory.

### Local testing

```bash
npm run serve
```

This will start a local server at http://localhost:3000 where you can preview the website.

## Deployment

The site is automatically deployed to GitHub Pages whenever you push to the main branch. The GitHub workflow in `.github/workflows/deploy.yml` handles the build and deployment process.

## Adding content

To add new pages to the site, create Markdown files in the `src` directory. Each file should include front matter with at least a title and layout:

```markdown
---
title: Your Page Title
layout: default.hbs
---

# Your Page Content

Write your content in Markdown format.
```

## Customizing the layout

Layout templates are stored in the `layouts` directory as Handlebars templates.
