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

    /*
    this.addEventListener('NutrientRich-api-changed', (e) => {
      this.setState({
        apiKey: e.detail
      });
    });
    */

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
          try {
            localStorage.setItem(
              'NutrientRich-foodInfo-cache', JSON.stringify(foodInfo)
            );
          } catch (err) {
            // Persistent storage not being allowed on Firefox to
            //   store our 26MB file
            // eslint-disable-next-line no-console -- Inform user
            console.log('Failed to set cache:', err);
          }
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
  hideZeroChanged (e) {
    const {checked: hideZeroAmountFoods} = e.target;
    localStorage.setItem(
      'NutrientRich-hide-zero', hideZeroAmountFoods
    );
    this.setState({
      hideZeroAmountFoods
    });
    this.foodsComponent.update({
      hideZeroAmountFoods: this.state.hideZeroAmountFoods
    });
  }

  /**
   * @param {Event} e
   * @returns {void}
   */
  targetClosenessChanged (e) {
    const {value: targetCloseness} = e.target;

    // eslint-disable-next-line no-console -- Debugging
    console.log('new value', targetCloseness);
    localStorage.setItem('NutrientRich-target-closeness', targetCloseness);

    this.setState({targetCloseness});

    this.foodsComponent.update({
      targetCloseness
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
   * Attribute only available here. We could probably drop this
   * in favor of plain elements; just keeping in case need to
   * pass or resuming passing in data.
   * @returns {void}
   */
  created () {
    // const apiBaseURL = this.getAttribute('api-base-url');
    // Change to a property if this might be set by the
    //   user (e.g., for access to other food APIs)
    // this.apiKey = this.getAttribute('api-key');

    this.nutrientChoiceComponent = new NutrientRichNutrientChoice({
      // apiBaseURL
    });
    this.foodsComponent = new NutrientRichFoods({
      // apiBaseURL
    });

    // Needed when `created` is used
    return this.render();
  }

  /**
   * @returns {void}
   */
  render () {
    return this.html`
      <h2>Nutrient Rich</h2>
      <h3>Food Finder Toward Meeting Nutrient Requirements</h3>
      <section class="controls">
        <label>
          <input
            type="checkbox"
            data-call="hideZeroChanged"
            onclick=${this}
            ?checked=${
  this.state.hideZeroAmountFoods
}>
          Hide zero-amount foods
        </label>
        <br><br>
        <label>
          Closeness direction must be
          <select
            data-call="targetClosenessChanged"
            onchange=${this}>
            ${[
    ['either', 'greater or less than'],
    ['greater', 'greater than'],
    ['less', 'less than']
  ].map(([value, text]) => {
    return `<option value="${value}"${
      this.state.targetCloseness === value ? ' selected' : ''
    }>${text}</option>`;
  })}
          </select> target
        </label>
        <br><br>
        <label>Amount of ingredient needed:
          <input
            required="required"
            id="ingredient-needed"
            data-call="ingredientNeededChanged"
            onchange=${this}
            value="${this.state.ingredientNeeded}">
        </label> ${this.state.chosenNutrientUnitName}
        <br><br>

        ${
  // Make these conditional to avoid showing empty skeletons
  // this.state.apiKey ?
  this.nutrientChoiceComponent.update({
    // apiKey: this.state.apiKey
  })
  // : ''
}
        <br><br>
        <nutrient-rich-preferences></nutrient-rich-preferences>
        <br><br><br>
      </section>
      <section>
        ${
  // this.state.apiKey ?
  this.foodsComponent.update({
    // apiKey: this.state.apiKey,
    chosenNutrientName: this.state.chosenNutrientName,
    chosenNutrientUnitName: this.state.chosenNutrientUnitName,
    totalNeeded: this.state.ingredientNeeded,
    hideZeroAmountFoods: this.state.hideZeroAmountFoods,
    targetCloseness: this.state.targetCloseness
  })
  // : */ ''
}
      </section>
    `;
  }

  /**
   * @returns {{
   * apiKey: ApiKey,
   * ingredientNeeded: Ingredient,
   * chosenNutrientUnitName: Unit,
   * hideZeroAmountFoods: boolean,
   * targetCloseness: "either"|"greater"|"less"
   * }}
   */
  get defaultState () {
    // const {apiKey} = this;

    const ingredientNeeded = localStorage.getItem(
      'NutrientRich-ingredient-needed'
    ) || this.ingredientNeeded;

    const hideZeroAmountFoods = JSON.parse(localStorage.getItem(
      'NutrientRich-hide-zero'
    ) || 'true');

    const targetCloseness = localStorage.getItem(
      'NutrientRich-target-closeness'
    ) || 'either';

    return {
      // apiKey,
      hideZeroAmountFoods,
      targetCloseness,
      ingredientNeeded,
      chosenNutrientUnitName: '',
      chosenNutrientName: 'Energy'
    };
  }
}

NutrientRichApp.define('nutrient-rich-app');

export default NutrientRichApp;
