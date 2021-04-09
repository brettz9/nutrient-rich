import HyperHTMLElement from '../../vendor/hyperhtml-element.js';

// CUSTOM ELEMENTS
import NutrientRichFoods from './NutrientRichFoods.js';
import NutrientRichNutrientChoice from './NutrientRichNutrientChoice.js';
import /* NutrientRichPreferences fro */ './NutrientRichPreferences.js';

/**
 * @extends HyperHTMLElement
 */
class NutrientRichApp extends HyperHTMLElement {
  /**
   * @param {PlainObject} [opts]
   * @param {NutrientName} [opts.ingredientNeeded]
   * @returns {NutrientRichApp}
   */
  constructor ({ingredientNeeded} = {}) {
    super();

    this.ingredientNeeded = ingredientNeeded;

    this.addEventListener('NutrientRich-api-changed', (e) => {
      this.setState({
        apiKey: e.detail
      });
    });

    /**
     * @param {Event} e
     * @returns {void}
     */
    this.addEventListener('NutrientRich-refresh-nutrients', async (e) => {
      let nutrients;
      const {caching, noForce} = e.detail;
      if (caching && noForce) {
        nutrients = localStorage.getItem('NutrientRich-nutrients-cache');
      }
      if (nutrients) {
        this.nutrientChoiceComponent.update({
          nutrients: JSON.parse(nutrients)
        });
      } else {
        nutrients = await this.nutrientChoiceComponent.getNutrients();
        if (caching) {
          localStorage.setItem(
            'NutrientRich-nutrients-cache', JSON.stringify(nutrients)
          );
        }
        if (!noForce) {
          this.render();
        }
      }
    });

    /**
     * @param {Event} e
     * @returns {void}
     */
    this.addEventListener('NutrientRich-refresh-foods', async (e) => {
      let foodInfo;
      const {caching, noForce} = e.detail;
      if (caching && noForce) {
        foodInfo = localStorage.getItem('NutrientRich-foodInfo-cache');
      }
      if (foodInfo) {
        this.foodsComponent.update({
          foodInfo: JSON.parse(foodInfo)
        });
      } else {
        foodInfo = await this.foodsComponent.getFoods();
        if (caching) {
          localStorage.setItem(
            'NutrientRich-foodInfo-cache', JSON.stringify(foodInfo)
          );
        }
        if (!noForce) {
          this.render();
        }
      }
    });

    /**
     * @param {Event} e
     * @returns {void}
     */
    this.addEventListener('NutrientRich-nutrient-changed', ({
      detail: {chosenNutrientName, chosenNutrientUnitName, totalNeeded}
    }) => {
      this.setState({
        chosenNutrientName, chosenNutrientUnitName, totalNeeded
      });
    });

    /**
     * @param {Event} e
     * @returns {void}
     */
    this.addEventListener('NutrientRich-foodInfo-changed', (e) => {
      this.nutrientChoiceComponent.setState({
        foodInfo: e.detail
      });
    });
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  ingredientNeededChanged (e) {
    const {value: ingredientNeeded} = e.target;

    // eslint-disable-next-line no-console -- Debugging
    console.log('new value', ingredientNeeded);
    localStorage.setItem('NutrientRich-ingredient-needed', ingredientNeeded);

    this.setState({ingredientNeeded});

    this.nutrientChoiceComponent.update({
      ingredientNeeded
    });
  }

  /**
   * Attribute only available here.
   * @returns {void}
   */
  created () {
    const apiBaseURL = this.getAttribute('api-base-url');
    // Change to a property if this might be set by the
    //   user (e.g., for access to other food APIs)
    this.apiKey = this.getAttribute('api-key');

    this.nutrientChoiceComponent = new NutrientRichNutrientChoice({
      apiBaseURL
    });
    this.foodsComponent = new NutrientRichFoods({
      apiBaseURL
    });

    // Needed when `created` is used
    return this.render();
  }

  /**
   * @returns {void}
   */
  render () {
    return this.html`
      <nutrient-rich-preferences></nutrient-rich-preferences>

      <br>
      <section>
        <label>Amount of ingredient needed:
          <input
            id="ingredient-needed"
            data-call="ingredientNeededChanged"
            onchange=${this}
            value="${this.state.ingredientNeeded}">
        </label> ${this.state.chosenNutrientUnitName}<br><br>

        ${
  // Make these conditional to avoid showing empty skeletons
  this.state.apiKey
    ? this.nutrientChoiceComponent.update({
      apiKey: this.state.apiKey
    })
    : ''}
            <br><br>
        ${
  this.state.apiKey
    ? this.foodsComponent.update({
      apiKey: this.state.apiKey,
      chosenNutrientName: this.state.chosenNutrientName,
      totalNeeded: this.state.ingredientNeeded
    })
    : ''}
      </section>
    `;
  }

  /**
   * @returns {{
   * apiKey: ApiKey,
   * ingredientNeeded: Ingredient,
   * chosenNutrientUnitName: Unit
   * }}
   */
  get defaultState () {
    const {apiKey} = this;

    const ingredientNeeded = localStorage.getItem(
      'NutrientRich-ingredient-needed'
    ) || this.ingredientNeeded;

    return {
      foodInfo: [],
      apiKey,
      ingredientNeeded,
      chosenNutrientUnitName: '',
      chosenNutrientName: ''
    };
  }
}

NutrientRichApp.define('nutrient-rich-app');

export default NutrientRichApp;
