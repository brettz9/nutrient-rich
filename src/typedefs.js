/* eslint-disable unicorn/no-empty-file, import/unambiguous -- Typedefs only */

/**
 * `g`, etc.
 * @typedef {string} Unit
 */

/**
 * @typedef {Integer} FDCID
 */

/**
 * @typedef {string} NutrientName
 */

/**
 * @typedef {PlainObject} FoodNutrient
 * @property {Float} amount
 * @property {NutrientName} name
 * @property {string} number
 * @property {Unit} unitName
 */

/**
 * Has more properties, but these are all that concern for now.
 * @typedef {PlainObject} FoodInfo
 * @property {FDCID} fdcId
 * @property {string} description
 * @property {FoodNutrient[]} foodNutrients
 */

/**
 * @typedef {PlainObject<string,string>} Nutrients
 */

/**
 * @typedef {string} Ingredient
 */

/**
 * @typedef {string} ApiKey
 */
