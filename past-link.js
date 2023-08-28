const fs = require('fs');
const path = require('path');

const linkId = process.argv[2]

if (linkId.match(/^\d{4}$/) === null) {
  console.log('There shuld be 4 digits')
  process.exit(1)
}
const srcFolder = 'src';
const watchedFile = 'i.html'

const inputFilePath = path.join(srcFolder, watchedFile)

// Read the input HTML file
let fileContent = fs.readFileSync(inputFilePath, 'utf-8');

fileContent = fileContent.replace(/\{\{CLICK\d{4}\}\}/g, `{{CLICK${linkId}}}`)


// Save text content file
fs.writeFileSync(inputFilePath, fileContent)