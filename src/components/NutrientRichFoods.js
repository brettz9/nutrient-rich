import HyperHTMLElement from '../../vendor/hyperhtml-element.js';
import jQuery from '../../vendor/jquery.min.js';
import dt from '../../vendor/jquery.dataTables.js';
import {roundDigits} from '../utils.js';

window.dt = dt(window, jQuery);

/**
 * @param {string} name
 * @returns {string}
 */
function normalizeUnitName (name) {
  return new Map([
    ['MG', 'mg'],
    ['G', 'g'],
    ['UG', 'µg']
  ]).get(name) || name;
}

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
      chosenNutrientName: 'Amino acids',
      foodInfo: this.foodInfo || []
    };
  }

  /**
   * @returns {void}
   */
  created () {

  }

  /**
   * @returns {void}
   */
  render () {
    const {chosenNutrientName, totalNeeded} = this.state;

    // console.log('foodInfo', this.state.foodInfo);

    const rows = this.state.foodInfo.map(({
      fdcId: id, description: desc, foodNutrients
    }) => {
      let nutrientAmount = 0;
      let nutrientAmountPerUnit = 0;
      let nutrientUnitName = '';

      if (!foodNutrients.some(({amount, name, unitName}) => {
        // console.log('chosenNutrientName === name', chosenNutrientName, name);
        nutrientUnitName = normalizeUnitName(unitName);
        if (chosenNutrientName !== name ||
          nutrientUnitName !== this.state.chosenNutrientUnitName
        ) {
          return false;
        }
        // eslint-disable-next-line no-console -- Debugging
        console.log(
          'nme === name',
          nutrientUnitName,
          this.state.chosenNutrientUnitName,

          chosenNutrientName === name,
          chosenNutrientName, name,
          totalNeeded, amount
        );

        const amountFactor = totalNeeded / amount;

        nutrientAmount = roundDigits(amount);
        nutrientAmountPerUnit = amountFactor === Number.POSITIVE_INFINITY
          ? 'N/A'
          : roundDigits(amountFactor);
        return true;
      })) {
        // console.log('not found', chosenNutrientName,
        //   foodNutrients.map(({name}) => name)
        // );
      }

      // 100 GRAND Bar (early in list); id=1104067
      return [
        desc,
        nutrientAmountPerUnit,
        nutrientAmount,
        nutrientUnitName
      ];
    });

    const columns = [
      'Food',
      'Amount per unit',
      'Amount of food required'
    ].map((column) => ({title: column}));

    const tableContainer = this.html`
      <table>
        <thead></thead>
        <tbody>
        </tbody>
      </table>
    `;

    const table = tableContainer.querySelector('table');
    jQuery(table).DataTable({
      destroy: true,
      data: rows,
      columns
    });

    return tableContainer;
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
