#!/usr/bin/node

// To run:
//  1. export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID_HERE>
//  2. export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY_HERE>
//  3. node scripts/detect-document-text.js /path/to/file

import fs from 'fs';
import textract from '../src/textract.js';
import Scan from '../src/models/Scan.js';

function errorExit(e) {
  console.error(e);
  process.exit(1);
}

const filePath = process.argv[2];

async function main() {
  const data = await fs.promises.readFile(filePath);
  const response = await textract.detectDocumentText({ data });
  const scan = Scan.fromTextractResponse(response);
  
  return scan.text;
}

main()
  .catch(errorExit)
  .then(console.log);
