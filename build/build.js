import {readFile, writeFile} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

// eslint-disable-next-line no-shadow -- Polyglot
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} name
 * @returns {string}
 */
function normalizeUnitName (name) {
  return new Map([
    ['MG', 'mg'],
    ['G', 'g'],
    ['UG', 'µg'],
    ['KCAL', 'kcal']
  ]).get(name) || name;
}

/**
 * @param {{foodNutrients: {name, unitName, number}}[]} results
 * @returns {void}
 */
async function saveNutrients (results) {
  const nutrientObjs = [];
  results.forEach(({foodNutrients}) => {
    foodNutrients.forEach(({
      // `id` isn't part of the food result nutrient lists unless
      //   getting an individual food item, so we use `number` which
      //   appears it may also function as an ID (if not, we could try
      //   name + unitName)
      // name, unitName, number
      name, unitName, number
    }) => {
      // Do we need these?
      if ((/^\d+:\d+$/u).test(name)) {
        return;
      }
      if (!nutrientObjs.some(({number: num /* , name: nutrientName */}) => {
        return num === number;
      })) {
        nutrientObjs.push({
          name,
          unitName: normalizeUnitName(unitName),
          number
        });
      }
    });
  });
  nutrientObjs.sort(
    ({name: nameA}, {name: nameB}) => {
      return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    }
  );
  return await writeFile(
    join(
      __dirname,
      '../data/nutrients.json'
    ),
    JSON.stringify(nutrientObjs, null, indent)
  );
}

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
  indent = 0,

  updateNutrientsOnly = false
} = JSON.parse(await readFile(join(__dirname, '../config.json')));

const foodsFile = join(
  __dirname,
  `../data/food-items${pageSize}_pages1-${maxPageNumber}.json`
);

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

if (updateNutrientsOnly) {
  await saveNutrients(
    JSON.parse(await readFile(foodsFile, 'utf8'))
  );

  // eslint-disable-next-line no-console -- CLI
  console.log('Saved nutrients file only!');
} else {
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
    foodsFile,
    JSON.stringify(results, null, indent)
  );

  await saveNutrients(results);

  // eslint-disable-next-line no-console -- CLI
  console.log('Complete!');
}
