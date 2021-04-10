'use strict';

const {writeFile} = require('fs').promises;
const {join} = require('path');

// eslint-disable-next-line no-shadow -- Polyglot
const fetch = require('node-fetch');

// CONFIG
const {
  // STEPS:
  // 1. GET YOUR OWN USDA KEY; SEE
  //    https://fdc.nal.usda.gov/api-key-signup.html
  // 2. Copy `config-sample.json` to `config.json` and change the `apiKey`
  //    value to that received in step 1.
  apiKey,

  // The main host + API path will be querying
  baseURL = 'https://api.nal.usda.gov/fdc/v1/',

  // Use max pageSize
  pageSize = '200',

  // Currently the max without erring for size 200 is 50
  maxPageNumber = 50,

  // API mentions this will later be changed to `description`
  sortBy = 'lowercaseDescription.keyword',

  // Set to 2 or 4 for readable, but optimizing for network speed
  indent = 0
} = require('../config.json');

/**
 * @param {number|string} pageNumber
 * @returns {string}
 */
function getURL (pageNumber) {
  const url = `${baseURL}foods/list?api_key=${
    apiKey
  }&sortOrder=asc&sortBy=${
    sortBy
  }&pageSize=${pageSize}&pageNumber=${
    pageNumber
  }`;

  return url;
}

(async () => {
const pageNumbers = [];
const results = (await Promise.all(
  [...Array.from({
    length: maxPageNumber + 1
  }).keys()].slice(1).map(async (pageNumber) => {
    const req = await fetch(getURL(pageNumber));
    const json = await req.json();
    /*
    // Use this approach if going to load incrementally
    writeFile(
      join(__dirname, `../data/foodSize${pageSize}-page${pageNumber}`),
      JSON.stringify(json, null, 2)
    );
    return pageNumber;
    */
    pageNumbers.push(pageNumber);
    return json;
  })
)).flat();

// eslint-disable-next-line no-console -- CLI
console.log('pageNumbers', pageNumbers);

writeFile(
  join(
    __dirname,
    `../data/food-items${pageSize}_pages1-${maxPageNumber}.json`
  ),
  JSON.stringify(results, null, indent)
);

// eslint-disable-next-line no-console -- CLI
console.log('Complete!');
})();
