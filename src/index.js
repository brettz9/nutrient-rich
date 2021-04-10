import HyperHTMLElement from '../vendor/hyperhtml-element.js';

import {$} from './utils.js';

// CUSTOM ELEMENTS
import /* NutrientRichApp from */ './components/NutrientRichApp.js';

// const baseURL = 'https://api.nal.usda.gov/fdc/v1/';

(async () => {
if (!navigator.storage || !navigator.storage.persist) {
  HyperHTMLElement.bind($('body'))`
    <b>Your browser does not support persistent storage.
      Please use a browser with
        <code>navigator.storage.persist</code>
      support.
    </b>
  `;
  return;
}
HyperHTMLElement.bind($('body'))`
  <b>Requesting permissions...</b>
`;
const persistent = await navigator.storage.persist();
if (persistent) {
  HyperHTMLElement.bind($('body'))`
    <nutrient-rich-app />
  `;
  // api-base-url="${baseURL}"
} else {
  HyperHTMLElement.bind($('body'))`
    <b>You must approve permissions to use this application.
        Refresh to try again.</b>
  `;
}
})();
