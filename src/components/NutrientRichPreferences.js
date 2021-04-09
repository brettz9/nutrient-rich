import HyperHTMLElement from '../../vendor/hyperhtml-element.js';
/**
 * @extends HyperHTMLElement
 */
class NutrientRichPreferences extends HyperHTMLElement {
  /**
   * @param {string} apiKey
   */
  constructor (apiKey) {
    super();
    this.apiKey = apiKey;
    window.addEventListener('storage', () => {
      this.setState({
        cacheNutrients: JSON.parse(
          localStorage.getItem('NutrientRich-cache-nutrients') || 'true'
        ),
        cacheFoods: JSON.parse(
          localStorage.getItem('NutrientRich-cache-foods') || 'true'
        ),
        apiKey: localStorage.getItem('NutrientRich-api-key')
      });
      this.refresh(apiKey);
    });
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  cacheNutrientsChanged (e) {
    const {checked: cacheNutrients} = e.target;
    localStorage.setItem('NutrientRich-cache-nutrients', cacheNutrients);

    // Redundant with storage listener?
    this.setState({
      cacheNutrients
    });
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  cacheFoodsChanged (e) {
    const {checked: cacheFoods} = e.target;
    localStorage.setItem('NutrientRich-cache-foods', cacheFoods);

    // Redundant with storage listener?
    this.setState({
      cacheFoods
    });
  }

  /**
   * Necessary to cause a re-render of the parent when `apiKey` is set;
   * otherwise we'd have to have parent component obtain the API key.
   * `onconnected` could also have been used.
   * @returns {NutrientRichPreferences}
   */
  created () {
    this.refresh(localStorage.getItem('NutrientRich-api-key'));
    return this.render();
  }

  /**
   * @returns {void}
   */
  render () {
    return this.html`
    <fieldset>
      <legend>Preferences</legend>
      <label>API Key:
        <input type="password"
          data-call="apiKeyChanged"
          onchange=${this}
          value=${this.state.apiKey}>
      </label><br><br>
      <label>
        Cache nutrients for reload:
        <input
          name="cacheNutrients"
          type="checkbox"
          data-call="cacheNutrientsChanged"
          onchange=${this}
          ?checked=${this.state.cacheNutrients}>
      </label><br><br>
      <label>
        Cache foods for reload:
        <input
          name="cacheFoods"
          type="checkbox"
          data-call="cacheFoodsChanged"
          onchange=${this}
          ?checked=${this.state.cacheFoods}>
      </label><br><br>
      <button
        data-call="refreshNutrients"
        onclick=${this}>Refresh Nutrients</button>
      <button
        data-call="refreshFoods"
        onclick=${this}>Refresh Foods</button>
    </fieldset>
    `;
  }

  /**
   * @param {string} apiKey
   * @returns {void}
   */
  refresh (apiKey) {
    if (!apiKey) {
      return;
    }
    this.dispatch('NutrientRich-api-changed', apiKey);
    this.refreshNutrients({noForce: true});
    this.refreshFoods({noForce: true});
  }

  /**
   * @param {Event} e
   * @param {boolean} e.noForce
   * @returns {void}
   */
  refreshNutrients ({noForce}) {
    this.dispatch('NutrientRich-refresh-nutrients', {
      noForce,
      caching: this.state.cacheNutrients
    });
  }

  /**
   * @param {Event} e
   * @param {boolean} e.noForce
   * @returns {void}
   */
  refreshFoods ({noForce}) {
    this.dispatch('NutrientRich-refresh-foods', {
      noForce,
      caching: this.state.cacheFoods
    });
  }

  /**
   * @returns {{apiKey: string}}
   */
  get defaultState () {
    const apiKey = localStorage.getItem('NutrientRich-api-key') || this.apiKey;

    const cacheNutrients = JSON.parse(
      localStorage.getItem('NutrientRich-cache-nutrients') || 'true'
    );
    const cacheFoods = JSON.parse(
      localStorage.getItem('NutrientRich-cache-foods') || 'true'
    );

    return {
      apiKey,
      cacheNutrients,
      cacheFoods
    };
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  apiKeyChanged (e) {
    const {value: apiKey} = e.target;

    // Todo: For privacy, should allow fresh retrieval
    localStorage.setItem('NutrientRich-api-key', apiKey);

    // eslint-disable-next-line no-console -- Debugging
    console.log('new value', apiKey);

    this.setState({apiKey});

    this.refresh(apiKey);
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

NutrientRichPreferences.define('nutrient-rich-preferences');

export default NutrientRichPreferences;
