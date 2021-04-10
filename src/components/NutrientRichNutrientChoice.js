import HyperHTMLElement from '../../vendor/hyperhtml-element.js';

// Todo: Could cache chosen name and dispatch event about localStorage of
//   previous choice

/**
 * @extends HyperHTMLElement
 */
class NutrientRichNutrientChoice extends HyperHTMLElement {
  /**
   * @param {PlainObject} opts
   * @param {string} opts.apiBaseURL
   * @param {Nutrients} opts.nutrients
   */
  constructor ({apiBaseURL, nutrients}) {
    super();
    this.apiBaseURL = apiBaseURL;
    this.nutrients = nutrients;
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
   * @returns {{nutrients: Nutrients}}
   */
  get defaultState () {
    return {
      // Amino Acids (early in list after stranger DHA names)
      selectedNutrient: '629',
      apiKey: '',
      nutrients: this.nutrients || []
    };
  }
  /**
   * @returns {void}
   */
  render () {
    return this.html`<label>
      <b>Nutrients</b>
      <select
        id="nutrient-choice"
        data-call="nutrientChoiceChanged"
        onchange=${this}>
        ${
  this.state.nutrients.map(({number, name, unitName}) => {
    return `<option
              data-chosenNutrientName="${name}"
              data-chosenNutrientUnitName="${unitName}"
              value="${number}"${
  number === this.state.selectedNutrient ? ' selected="selected"' : ''
}>${`${name} (${unitName})`}</option>`;
  })}
      </select>
    </label>
    `;
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  nutrientChoiceChanged (e) {
    const option = e.target.selectedOptions[0];

    const chosenNutrientName = option.getAttribute('data-chosenNutrientName');
    const chosenNutrientUnitName = option.getAttribute(
      'data-chosenNutrientUnitName'
    );

    this.setState({
      selectedNutrient: option.value
    });

    this.dispatch('NutrientRich-nutrient-changed', {
      chosenNutrientName,
      chosenNutrientUnitName
    });
  }

  /**
   * @param {ApiKey} apiKey
   * @returns {Promise<Nutrients>}
   */
  async getNutrients (apiKey = this.state.apiKey) {
    /*
    // Live API (also probably was problematic in only getting a sampling
    //   of nutrients)
    const fdcId = '1104086';
    // const url = `https://api.nal.usda.gov/fdc/v1/json-spec?api_key=${apiKey}`;
    const url = `${this.apiBaseURL}food/${fdcId}?api_key=${
      encodeURIComponent(apiKey)
    }`;
    */
    const url = '../../data/nutrients.json';
    const req = await fetch(url);
    const nutrients = await req.json();

    // eslint-disable-next-line no-console -- Debugging
    console.log('nutrients JSON', nutrients);

    /*
    const nutrients = json.foodNutrients.map(({nutrient}) => {
      return nutrient;
    }).filter(({
      id, name, unitName
      // rank, number
    }) => {
      return !(/^\d+:\d+$/u).test(name);
    }).sort(
      ({name: nameA}, {name: nameB}) => {
        return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
      }
    ); */

    this.setState({
      nutrients
    });

    return nutrients;
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
}

NutrientRichNutrientChoice.define('nutrient-rich-nutrient-choice');

export default NutrientRichNutrientChoice;
