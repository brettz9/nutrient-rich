import HyperHTMLElement from '../../vendor/hyperhtml-element.js';
import {roundDigits} from '../utils.js';

/**
 * @extends HyperHTMLElement
 */
class NutrientRichFoods extends HyperHTMLElement {
  /**
   * @param {PlainObject} opts
   * @param {string} opts.apiBaseURL
   * @param {FoodInfo} opts.foodInfo
   */
  constructor ({apiBaseURL, foodInfo}) {
    super();
    this.apiBaseURL = apiBaseURL;
    this.foodInfo = foodInfo;
    this.dispatch('NutrientRich-foodInfo-changed', foodInfo);
  }

  /**
   * @todo Shouldn't be defined by hyperHTMLElement? Also onconnected?
   * @param {string} ev
   * @param {any} detail
   * @returns {void}
   */
  dispatch (ev, detail) {
    this.dispatchEvent(new CustomEvent(ev, {
      detail,
      bubbles: true,
      cancelable: true
    }));
  }

  /**
   * @param {{apiKey: ApiKey}} state
   * @returns {void}
   */
  update (state) {
    this.setState(state);
    return this.render();
  }

  /**
   * @returns {{foodInfo: FoodInfo}}
   */
  get defaultState () {
    return {
      apiKey: '',
      totalNeeded: '',
      chosenNutrientName: '',
      foodInfo: this.foodInfo || []
    };
  }

  /**
   * @returns {void}
   */
  render () {
    const {chosenNutrientName, totalNeeded} = this.state;

    return this.html`
      <table>
        <tr><th>Food</th>
          <th>Amount of food required</th>
          <th>Amount per unit</th></tr>
        ${
  this.state.foodInfo.map(({fdcId: id, description: desc, foodNutrients}) => {
    let nutrientAmount = 0;
    let nutrientAmountPerUnit = 0;
    let nutrientUnitName = '';

    foodNutrients.some(({amount, name, unitName}) => {
      // console.log('chosenNutrientName === name', chosenNutrientName, name);
      if (chosenNutrientName === name) {
        // eslint-disable-next-line no-console -- Debugging
        console.log(
          'nme === name', chosenNutrientName === name,
          chosenNutrientName, name, unitName,
          totalNeeded, amount
        );
        nutrientUnitName = unitName;

        const amountFactor = totalNeeded / amount;

        nutrientAmount = roundDigits(amount);
        nutrientAmountPerUnit = amountFactor === Number.POSITIVE_INFINITY
          ? 'N/A'
          : roundDigits(amountFactor);
        return true;
      }
      return false;
    });

    // 100 GRAND Bar (early in list); id=1104067
    return `<tr><td><label for="amount_${id}">${desc}</label></td>` +
      `<td><input id="amount_${id}" value=${
        nutrientAmount
      }> <span id="unit_${id}">${
        nutrientUnitName
      }</span></td>` +
      `<td><input id="amountPerUnit_${id}" value=${
        nutrientAmountPerUnit
      }></td></tr>`;
  })
}
      </table>
    `;
  }

  // fdcId=1104086;
  // format=abridged|full (full is default)
  // nutrients=1,2,3,...25 (requesting on these nutrient IDs in results)

  /**
   * @param {ApiKey} apiKey
   * @returns {Promise<void>}
   */
  async getFoods (apiKey = this.state.apiKey) {
    // Todo: Supply nutrients to API for shortening specific food result or
    //   just cache?

    const apiURL = `${this.apiBaseURL}foods/list?api_key=${
      encodeURIComponent(apiKey)
    }`; // &sortBy=description&sortOrder=asc  (What is the correct structure)?
    const req = await fetch(apiURL);

    // fdcId, description
    // dataType, publicationDate, foodCode
    const foodInfo = await req.json();

    // eslint-disable-next-line no-console -- Debugging
    console.log('foods JSON', foodInfo);

    this.dispatch('NutrientRich-foodInfo-changed', foodInfo);

    this.setState({
      foodInfo
    });

    return foodInfo;
  }
}

NutrientRichFoods.define('nutrient-rich-foods');

export default NutrientRichFoods;