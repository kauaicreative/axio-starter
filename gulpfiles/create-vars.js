/**
 * `gulp vars` automates the creation of editor-color-palette theme_support php file
 * and related scss and css files all from the manifest.js gulp configuration file.
 * V1.0

 *
 * Add to gulpfile.js
 *
 const {vars} = require('./gulpfiles/create-vars.js')
 exports.vars = vars

 *
 * Add config to manafest.js
 *
 vars: () => {
    return {
      "colors": [
        "primary:#053b49",
        "accent:#14a79d",
        "tertiary:#d64947",
        "black:#000",
        "grey-dark:#053B49",
        "grey:#707070",
        "grey-light:#E3E3E3",
        "white:#fff",
      ],
    }
  },

 *
 * The following files are created:
 *
 ./assets/styles/utils/_variables-scss.scss
 ./assets/styles/utils/_variables-var.css
 ./assets/styles/utils/_variables-has.css
 ./inc/editor-color-palette.php
 */

const fs = require('fs');

const manifest = require('../assets/manifest.js');
let config = {
  'vars': manifest.vars(),
}

// todo: we could do custom font sizes here as well

exports.vars = () => {
  if (!config.vars) {
    console.log('No vars found in manifest!');
    return Promise.resolve();
  }
  let comment = "Created via `gulp vars`. Defined in theme's manifest.js"
  let scss_file = './assets/styles/utils/_variables-scss.scss';
  let var_file = './assets/styles/utils/_variables-var.css';
  let has_file = './assets/styles/utils/_variables-has.css'
  let themeSupport_file = './inc/auto/editor-color-palette.php'
  let scssColors = ''
  let hasBackground = ''
  let hasColor = ''
  let hasSize = ''
  let varData = ''
  let themeSupportColor = ''
  let themeSupportSize = ''

  if (config.vars.colors) {
    console.log("Vars - create colors:")

    for (let i in config.vars.colors) {
      let color = config.vars.colors[i].replace('$', '').replace(';', '').split(':')
      let key = color[0]
      let val = color[1]
      let styles = `background:${val}; color:white; display:block;`;

      console.log(`%c\t🎨 ${key} = ${val}`, styles);

      scssColors += `$color-${key}: ${val};\n`;

      // hex
      //dataScss2 += `.has-${key}-background-color {background-color: ${val};}\n`;
      //dataScss3 += `.has-${key}-color {color: ${val};}\n`;
      //--vars
      hasBackground += `.has-${key}-background-color {background-color: var(--color-${key})}\n`;
      hasColor += `.has-${key}-color {color: var(--color-${key})}\n`;

      varData += `\t--color-${key}: ${val};\n`;

      themeSupportColor += `
  [ 'name' => '${key.charAt(0).toUpperCase() + key.slice(1)}', 
    'slug' => '${key}', 
    'color' => '${val}', 
  ],`;
    }

    themeSupportColor = `add_theme_support( 'editor-color-palette', [${themeSupportColor}
]);
`
  }

  if (config.vars.sizes) {
    console.log("Vars - create sizes:")

    varData += `\n`

    for (let i in config.vars.sizes) {
      let size = config.vars.sizes[i].split(':')
      let key = size[0]
      let val = size[1]

      console.log(`\t🖌 ${key} = ${val}`);

      themeSupportSize += `
  [ 'name' => '${key.charAt(0).toUpperCase() + key.slice(1)}', 
    'shortName' => '${key.charAt(0).toUpperCase()}', 
    'slug' => '${key}', 
    'size' => '${val}', 
  ],`;

      hasSize += `.has-${key}-font-size {font-size: var(--size-${key})}\n`;

      varData += `\t--size-${key}: ${val};\n`;

    }

    themeSupportSize = `add_theme_support( 'editor-font-sizes', [${themeSupportSize}
]);
`
  }

  varData = `/* ${comment} */\n${varData}`

  scssColors = `// ${comment}\n${scssColors}`

  let hasData = `/* ${comment} */ 
${hasBackground}
${hasColor}
${hasSize}`

  let themeSupport = `<?php\n// ${comment}\n${themeSupportColor}\n${themeSupportSize}\n`

  varData = `:root {\n${varData}}`

  console.log('Vars - write Files');

  console.log(`\t${scss_file}`);
  fs.writeFileSync(scss_file, scssColors);

  console.log(`\t${var_file}`);
  fs.writeFileSync(var_file, varData);

  console.log(`\t${has_file}`);
  fs.writeFileSync(has_file, hasData);

  console.log(`\t${themeSupport_file}`);
  fs.writeFileSync(themeSupport_file, themeSupport);

  return Promise.resolve();
}
