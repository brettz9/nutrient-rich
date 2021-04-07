import HHE from '../vendor/hyperhtml-element.js';

const $ = (sel) => document.querySelector(sel);

// Better separation by simplifying the supplied objects before adding
const Templates = {
  body (render) {
    render`
      <label>API Key: <input type="password" id="api_key"></label><br><br>

      <label>Amount of ingredient needed:
        <input id="ingredient-needed"></label><br><br>

      <div id="nutrients"></div>
      <div id="foods"></div>
    `;
  },
  '#nutrients' (render, nutrients) {
    render`
      <label>
        <b>Nutrients</b>
        <select id="nutrient-choice">
          ${
  Object.entries(nutrients).sort(([, {name: nameA}], [, {name: nameB}]) => {
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
  }).map(([id, {name, unitName}]) => {
    return `<option data-name="${name}" ` +
              ` data-unitName="${unitName}" value="${id}"${
                // Amino Acids (early in list after stranger DHA names)
                id === 2042 ? ' selected="selected"' : ''
              }>${`${name} (${unitName})`}</option>`;
  })}
        </select>
      </label>
    `;
  },
  '#foods' (render, foods) {
    render`
      <b>Foods</b>
      <table>
        <tr><th>Food</th>
          <th>Amount of food required</th>
          <th>Amount per unit</th></tr>
        ${
  Object.entries(foods).map(([desc, id]) => {
    // 100 GRAND Bar (early in list); id=1104067
    return `<tr><td><label for="amount_${id}">${desc}</label></td>` +
            `<td><input id="amount_${id}"> <span id="unit_${id}"></span></td>` +
            `<td><input id="amountPerUnit_${id}"></td></tr>`;
  })
}
      </table>
    `;
  }
};

const template = (sel, ...args) => {
  const render = HHE.bind($(sel));
  Templates[sel](render, ...args);
};

export {$, template};
