# nutrient-rich

***This project is not yet complete.***

<!-- ```
npm i nutrient-rich
``` -->

## Changelog

The changelog can be found on the
[Releases page](https://github.com/brettz9/nutrient-rich/releases).

## Authors and license

[Brett Zamir](http://brett-zamir.me/) and
[contributors](https://github.com/brettz9/nutrient-rich/graphs/contributors).

MIT License, see the included [LICENSE-MIT.md](LICENSE-MIT.md) file.

## Data Source

U.S. Department of Agriculture, Agricultural Research Service.
FoodData Central, 2019. [fdc.nal.usda.gov](https://fdc.nal.usda.gov/).

## See also

- <https://catalog.data.gov/dataset?vocab_category_all=Food+Safety+and+Nutrition>

## To-dos

1. General fixes to input box setting, e.g., avoiding N/A?
    (and need for unit comparison?); reason for non-matching names?;
    have reactive property to update unit next to
    "Amount of ingredient needed" (and table inputs?) based on menu selection
1. Option to predownload all foods and/or nutrients and put in storage
1. Option to filter inputs by non-zero ones (and sort at least by potency,
    i.e., needing a lower amount), though might also prefer non-decimal ones
    or closer to "1"
1. Might use custom elements features of hyperHTMLElement for readability
1. Use `rank` if useful (a matter of proportional power?)

## Ideas for longer term

3D world to go shopping and show foods and their amounts that can make
a deficiency.

Like to get (or lose) so many grams of Vitamin C, you can take 10 oranges,
5 lemons, 20 watermeons, and the opposite if drinking 2 Coca Colas,
smoking 5 cigarrettes, etc.

I am thinking the user could choose to pile them so they look to scale
(easier to judge for shopping) or an option to just show the numbers.
