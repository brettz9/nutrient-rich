/* eslint-disable import/unambiguous -- Typedefs only */

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
 * @typedef {PlainObject<string,string>} Nutrients
 */
