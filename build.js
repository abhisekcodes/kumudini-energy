const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');

async function build() {
  const distDir = path.join(__dirname, 'dist');
  console.log('Starting production build...');

  // 1. Recreate clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir);
  fs.mkdirSync(path.join(distDir, 'css'));
  fs.mkdirSync(path.join(distDir, 'js'));
  fs.mkdirSync(path.join(distDir, 'assets'));

  // 2. Minify and copy CSS
  const rawCss = fs.readFileSync(path.join(__dirname, 'css', 'style.css'), 'utf8');
  const cssMinified = new CleanCSS({ level: 2 }).minify(rawCss);
  if (cssMinified.errors.length) {
    console.error('CSS Minification Errors:', cssMinified.errors);
    process.exit(1);
  }
  fs.writeFileSync(path.join(distDir, 'css', 'style.min.css'), cssMinified.styles);
  console.log('✓ Style minified successfully');

  // 3. Minify and copy JS
  const rawJs = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');
  const jsMinified = await minifyJs(rawJs, {
    compress: {
      drop_console: true,
      passes: 2
    },
    mangle: true
  });
  fs.writeFileSync(path.join(distDir, 'js', 'app.min.js'), jsMinified.code);
  console.log('✓ JS minified successfully');

  // 4. Copy Assets
  const assetsSrc = path.join(__dirname, 'assets');
  const assetsDst = path.join(distDir, 'assets');
  const files = fs.readdirSync(assetsSrc);
  for (const file of files) {
    fs.copyFileSync(path.join(assetsSrc, file), path.join(assetsDst, file));
  }
  console.log(`✓ Copied ${files.length} assets`);

  // 5. Minify and copy HTML with updated asset paths
  let rawHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  // Replace links to production minified versions
  rawHtml = rawHtml.replace('css/style.css?v=3.2', 'css/style.min.css?v=3.2');
  rawHtml = rawHtml.replace('js/app.js?v=3.2', 'js/app.min.js?v=3.2');

  const htmlMinified = await minifyHtml(rawHtml, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
  });
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlMinified);
  console.log('✓ HTML minified successfully');

  console.log('\nProduction build complete! Files compiled into ./dist/');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
