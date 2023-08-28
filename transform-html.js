const fs = require('fs');
const path = require('path');
const htmlMinifier = require('html-minifier-terser');

const srcFolder = 'src';
const distFolder = 'dist';
const watchedFile = 'i.html'
const minHtmlFile = 'min.html'
const txtFile = 'text.html'

const inputFilePath = path.join(srcFolder, watchedFile)
const outputHtmlMinFilePath = path.join(distFolder, minHtmlFile)
const outputTextFilePath = path.join(distFolder, txtFile);

// Check if distFolder exists, and create it if it doesn't
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder);
} else {
  // Remove existing contents of the distFolder
  fs.readdirSync(distFolder).forEach(file => {
    const filePath = path.join(distFolder, file)
    fs.unlinkSync(filePath)
  });
}


// Read the input HTML file
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

// Minify HTML content
 htmlMinifier.minify(fileContent, {
    collapseWhitespace: true,
    removeComments: true
  }).then(function(result) {

    // Save minified HTML file
    fs.writeFileSync(outputHtmlMinFilePath, result);    
  })



// Extract text content with line breaks
const underline = '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _'
const textContent = fileContent.
  replace(
    /<a.+?(?<click>\{\{CLICK\d+?\}\}).*?>(?<linktxt>.+?)<\/a>/gs,
    (...matches) => {
      // the groups object with them is always the last
      const groups = matches[matches.length - 1]
      return `${groups.linktxt.trim()} ${groups.click}`
    }
  ).
  replace(/<!--.+?-->/gs, '').
  replace(/(<([^>]+)>)/ig, '').
  replace(
    /^(?<begin>.*?)(?<click>\{\{CLICK\d+?\}\})(?<end>.*?)$/gm,
    (...matches) => {
      const groups = matches[matches.length - 1]
      return `${groups.begin} ${groups.end}\n${groups.click}`
    }
  ).
  replace(/&nbsp;/g, ' ').
  replace(/\p{Emoji_Presentation}/ug, '').
  replace(/[‍♀‍‼️✉️🗒️🗓🛍→↓←★☆♕⚑✪➤➡⬅⬆⬇↗↘↙↖⤵⤴✍✌	✏⚖️☑️✔️🗳️🗂️✈️❤️️️✴️✳️❇️₿🛎↑⓪①②③④⑤⑥⑦⑧⑨⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾❶❷❸❹❺❻❼❽❾❿]+/gu, '').
  replace(/ {2,}/g, ' ' ).
  replace(/^ +/gm, '' ).
  replace(/ +$/gm, '' ).
  replace(/\n{2,}/g, "\n" ).
  replace(/(\{\{CLICK\d+?\}\})/g, '>> <$1>').
  replace(/(?<line>^Visit your Member's Dashboard.*?$)/mg, `${underline}\n\n$<line>`)

  let header = ''
  if (textContent.includes('SurveyQueen.com')) {
    header = `//  Survey Queen  //\n${underline}\n`
  }
  if (textContent.includes('PanelPayDay.com')) {
    header = `//  PanelPayDay //\n${underline}\n`
  }
  if (textContent.includes('PanelBucks.com')) {
    header = `//  PanelBucks //\n${underline}\n`
  }
  if (textContent.includes('PaidSurveyDepot.com')) {
    header = `//  PaidSurveyDepot //\n${underline}\n`
  }

// Save text content file
fs.writeFileSync(outputTextFilePath, `${header}${textContent}`)
