import HyperHTMLElement from '../../vendor/hyperhtml-element.js';
import {roundDigits} from '../utils.js';

import DT from '../../vendor/dataTables.dataTables.js';

const highClosenessMax = '999999999';

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
   * @typedef {any} AnyValue
   */

  /**
   * @todo Shouldn't be defined by hyperHTMLElement? Also onconnected?
   * @param {string} ev
   * @param {AnyValue} detail
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
      // apiKey: '',
      targetCloseness: 'either',
      hideZeroAmountFoods: true,
      totalNeeded: '',
      chosenNutrientName: 'Energy',
      foodInfo: this.foodInfo || []
    };
  }

  /**
   * @returns {void}
   */
  render () {
    const {
      chosenNutrientName, totalNeeded, hideZeroAmountFoods,
      targetCloseness
    } = this.state;
    // console.log('foodInfo', this.state.foodInfo);

    if (!this.state.foodInfo.length) {
      return this.html`
        <div style="text-align: center;">
          <b><i>Loading...</i><br><br>(Depending on your connection,
            may take several minutes to download the 25 MB of
            food data, at least the first time.)</b>
        </div>
      `;
    }

    const rows = this.state.foodInfo.map(({
      // fdcId: id,
      description: desc, foodNutrients
    }) => {
      let nutrientAmount = 0;
      let nutrientAmountPerUnit = 0;
      let nutrientUnitName = '';
      let closenessToTarget = highClosenessMax;

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

        if (
          targetCloseness === 'either' ||
          (targetCloseness === 'greater' && amount - totalNeeded > 0) ||
          (targetCloseness === 'less' && amount - totalNeeded < 0)
        ) {
          closenessToTarget = roundDigits(
            Math.abs(totalNeeded - amount)
          );
        }

        nutrientAmountPerUnit = roundDigits(amount);
        nutrientAmount = amountFactor === Number.POSITIVE_INFINITY
          ? 'N/A'
          : roundDigits(amountFactor);
        return true;
      })) {
        /*
        // eslint-disable-next-line no-console -- Feedback
        console.log(
          'not found', chosenNutrientName,
          foodNutrients.map(({name}) => name)
        );
        */
        return [desc, '0', highClosenessMax, 'N/A'];
      }

      // 100 GRAND Bar (early in list); id=1104067
      return [
        desc,
        nutrientAmountPerUnit,
        closenessToTarget,
        nutrientAmount
        // nutrientUnitName
      ];
    }).filter((o) => {
      const nutrientAmountPerUnit = o?.[1];
      return !hideZeroAmountFoods ||
        (nutrientAmountPerUnit && nutrientAmountPerUnit !== '0');
    });

    const columns = [
      'Food',
      `Number of ${this.state.chosenNutrientUnitName} per serving`,
      'Closeness to target (lower is closer)',
      'Number of units of food required'
    ].map((column) => ({title: column}));

    const tableContainer = this.html`
      <table>
        <thead></thead>
        <tbody>
        </tbody>
      </table>
    `;

    // eslint-disable-next-line no-new -- jQuery DataTables API
    new DT('table', {
      destroy: true,
      columnDefs: [
        {className: 'dt-center', targets: [1, 3]}
      ],
      data: rows,
      columns
    });

    return tableContainer;
  }

  // fdcId=1104086;
  // format=abridged|full (full is default)
  // nutrients=1,2,3,...25 (requesting on these nutrient IDs in results)

  // * @param {ApiKey} apiKey
  /**
   * @returns {Promise<void>}
   */
  async getFoods (/* apiKey = this.state.apiKey */) {
    // Todo: Supply nutrients to API for shortening specific food result or
    //   just cache?

    const itemsPerPage = 200;
    const maxPages = 50;
    const url = `../data/food-items${
      itemsPerPage
    }_pages1-${maxPages}.json`;

    /*
    // This would only
    const url = `${this.apiBaseURL}foods/list?api_key=${
      encodeURIComponent(apiKey)
    }`; // &sortBy=description&sortOrder=asc  (What is the correct structure)?
    */

    const req = await fetch(url);

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
