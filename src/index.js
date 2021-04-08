import HyperHTMLElement from '../vendor/hyperhtml-element.js';

import {$} from './utils.js';

// CUSTOM ELEMENTS
import /* NutrientRichApp from */ './components/NutrientRichApp.js';

const baseURL = 'https://api.nal.usda.gov/fdc/v1/';

HyperHTMLElement.bind($('body'))`
  <nutrient-rich-app
    api-base-url="${baseURL}"
    />
`;
