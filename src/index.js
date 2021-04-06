import HHE from '../vendor/hyperhtml-element.js';

const Templates = {
  body () {
    HHE.bind($('body'))`
      <label>API Key: <input id="api_key"></label><br><br>

      <label>Amount of ingredient needed:
        <input id="ingredient-needed"></label><br><br>

      <div id="nutrients"></div>
      <div id="foods"></div>
    `;
  },
  nutrients (nutrients) {
    HHE.bind($('#nutrients'))`
      <label>
        <b>Nutrients</b>
        <select id="nutrient-choice">
          ${
  Object.entries(nutrients).sort(([, {name: nameA}], [, {name: nameB}]) => {
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
  }).map(([id, {name, unitName}]) => {
    return `<option data-name="${name}" ` +
              ` data-unitName="${unitName}" value="${id}"${
                // Amino Acids (early in list after stranger DHA names)
                id === 2042 ? ' selected="selected"' : ''
              }>${`${name} (${unitName})`}</option>`;
  })}
        </select>
      </label>
    `;
  },
  foods (foods) {
    HHE.bind($('#foods'))`
      <b>Foods</b>
      <table>
        <tr><th>Food</th>
          <th>Amount of food required</th>
          <th>Amount per unit</th></tr>
        ${
  Object.entries(foods).map(([desc, id]) => {
    // 100 GRAND Bar (early in list); id=1104067
    return `<tr><td><label for="amount_${id}">${desc}</label></td>` +
            `<td><input id="amount_${id}"> <span id="unit_${id}"></span></td>` +
            `<td><input id="amountPerUnit_${id}"></td></tr>`;
  })
}
      </table>
    `;
  }
};

const $ = (sel) => document.querySelector(sel);
const baseURL = 'https://api.nal.usda.gov/fdc/v1/';

Templates.body();

const apiKey = $('#api_key');

if (!apiKey.value) {
  apiKey.value = localStorage.getItem('api-key');
}
apiKey.addEventListener('change', (e) => {
  // eslint-disable-next-line no-console -- Debugging
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
  // eslint-disable-next-line no-console -- Debugging
  console.log('nutrients', nutrients);

  Templates.nutrients(nutrients);

  const {foods, foodInfo} = await getFoods();
  // eslint-disable-next-line no-console -- Debugging
  console.log('foods', foods);

  Templates.foods(foods);

  $('#nutrient-choice').addEventListener('change', (e) => {
    // const uName = e.target.getAttribute('data-unitName');
    const nme = e.target.selectedOptions[0].getAttribute('data-name');
    const totalNeeded = $('#ingredient-needed').value;

    foodInfo.forEach(({fdcId, foodNutrients}) => {
      foodNutrients.some(({amount, name, unitName}) => {
        if (nme === name) {
          console.log('nme === name', nme === name, nme, name, unitName, totalNeeded, amount);
          $(`#unit_${fdcId}`).value = unitName;

          const amountFactor = totalNeeded / amount;

          $(`#amount_${fdcId}`).value = amount;
          $(`#amountPerUnit_${fdcId}`).value = amountFactor;
          return true;
        }
        return false;
      });
    });
  });

  // Todo: Supply nutrients to API for shortening specific food result or
  //   just cache?
}

/**
 * @typedef {PlainObject} FoodNutrient
 * @property {Float} amount
 * @property {string} name
 * @property {string} number
 * @property {string} unitName
 */

/**
 * Has more proeprties, but these are all that concern for now.
 * @typedef {PlainObject} FoodInfo
 * @property {Integer} fdcId
 * @property {string} description
 * @property {FoodNutrient[]} foodNutrients
 */

/**
* @typedef {Object<string,string>} Foods
*/

/**
* @typedef {PlainObject} FoodsAndJSON
* @property {FoodInfo} foodInfo
* @property {Foods} foods
*/

/**
 * @returns {Promise<FoodsAndJSON>}
 */
async function getFoods () {
  const apiURL = `${baseURL}foods/list?api_key=${
    encodeURIComponent(apiKey.value)
  }`; // &sortBy=description&sortOrder=asc  (What is the correct structure)?
  const req = await fetch(apiURL);
  const foodInfo = await req.json();

  // eslint-disable-next-line no-console -- Debugging
  console.log('foods JSON', foodInfo);

  const foods = foodInfo.reduce((obj, {
    fdcId, description
    // dataType, publicationDate, foodCode
  }) => {
    obj[description] = fdcId;
    return obj;
  }, {});

  return {foodInfo, foods};
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
    encodeURIComponent(apiKey.value)
  }`;
  const req = await fetch(apiURL);
  const json = await req.json();

  // eslint-disable-next-line no-console -- Debugging
  console.log('nutrients JSON', json);

  const nutrients = json.foodNutrients.reduce((obj, {nutrient: {
    id, name, unitName
    // rank, number
  }}) => {
    if ((/^\d+:\d+$/u).test(name)) {
      return obj;
    }
    obj[id] = {name, unitName};
    return obj;
  }, {});

  return nutrients;
}
