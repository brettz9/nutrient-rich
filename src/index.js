import HHE from '../vendor/hyperhtml-element.js';

const Templates = {
  body () {
    HHE.bind($('body'))`
      <input id="api_key">
      <div id="nutrients"></div>
    `;
  },
  nutrients (nutrients) {
    HHE.bind($('#nutrients'))`
      <label>
        <b>Nutrients</b>
        <select>
          ${
  Object.entries(nutrients).sort(([nameA], [nameB]) => {
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
  }).map(([nameWithUnit, id]) => {
    return `<option value="${id}"${
      /* Amino Acids */ id === 2042 ? ' selected="selected"' : ''
    }>${nameWithUnit}</option>`;
  })}
        </select>
      </label>
    `;
  }
};

/*
/food/{fdcId}     GET     one food item
/foods     GET | POST     multiple food items using input FDC IDs
/foods/list     GET | POST     paged list of foods, in the 'abridged' format
/foods/search     GET | POST     list of foods matching search keywords
 */
const $ = (sel) => document.querySelector(sel);
const baseURL = 'https://api.nal.usda.gov/fdc/v1/';

Templates.body();

const apiKey = $('#api_key');

if (!apiKey.value) {
  apiKey.value = localStorage.getItem('api-key');
}
apiKey.addEventListener('change', (e) => {
  // eslint-disable-next-line no-console -- DEBUGGING
  console.log('new value', e.target.value);
  localStorage.setItem('api-key', e.target.value);
  setup();
});
setup();

/**
 * @returns {Promise<void>}
 */
async function setup () {
  const nutrients = await getNutrients();

  Templates.nutrients(nutrients);

  // Todo: Supply nutrients to API for shortening food result
  // eslint-disable-next-line no-console -- Testing
  console.log('nutrients', nutrients);
}

// fdcId=1104086;
// format=abridged|full (full is default)
// nutrients=1,2,3,...25 (requesting on these nutrient IDs in results)

/**
* @typedef {PlainObject<string,string>} Nutrients
*/

/**
 * @returns {Promise<Nutrients>}
 */
async function getNutrients () {
  // Just use a sample
  const fdcId = '1104086';

  // const apiURL = `https://api.nal.usda.gov/fdc/v1/json-spec?api_key=${apiKey}`;
  const apiURL = `${baseURL}food/${fdcId}?api_key=${
    apiKey.value
  }`;
  const req = await fetch(apiURL);
  const json = await req.json();

  // eslint-disable-next-line no-console -- Testing
  console.log('json', json);

  const nutrients = json.foodNutrients.reduce((obj, {nutrient: {
    id, name, unitName
    // rank, number
  }}) => {
    if ((/^\d+:\d+$/u).test(name)) {
      return obj;
    }
    obj[`${name} (${unitName})`] = id;
    return obj;
  }, {});

  return nutrients;
}
