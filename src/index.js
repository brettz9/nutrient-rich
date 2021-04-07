import {$, template} from './templates.js';

const roundDigits = (num, maxNumDecimals = 4) => {
  const factor = 10 ** maxNumDecimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};
const baseURL = 'https://api.nal.usda.gov/fdc/v1/';

template('body');

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

  template('#nutrients', nutrients);

  const {foods, foodInfo} = await getFoods();
  // eslint-disable-next-line no-console -- Debugging
  console.log('foods', foods);

  template('#foods', foods);

  $('#nutrient-choice').addEventListener('change', (e) => {
    // const uName = e.target.getAttribute('data-unitName');
    const nme = e.target.selectedOptions[0].getAttribute('data-name');
    const totalNeeded = $('#ingredient-needed').value;

    foodInfo.forEach(({fdcId, foodNutrients}) => {
      foodNutrients.some(({amount, name, unitName}) => {
        if (nme === name) {
          // eslint-disable-next-line no-console -- Debugging
          console.log(
            'nme === name', nme === name, nme, name, unitName,
            totalNeeded, amount
          );
          $(`#unit_${fdcId}`).value = unitName;

          const amountFactor = totalNeeded / amount;

          $(`#amount_${fdcId}`).value = roundDigits(amount);
          $(`#amountPerUnit_${fdcId}`).value =
            amountFactor === Number.POSITIVE_INFINITY
              ? 'N/A'
              : roundDigits(amountFactor);
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
