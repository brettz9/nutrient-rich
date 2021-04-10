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

1. Option to **filter** inputs by non-zero ones and **sort** at least by
    potency, i.e., needing a lower amount, though might also prefer
    non-decimal ones or closer to "1"

## Medium-priority (or lower) to-dos

1. Use `rank` if useful (a matter of proportional power?)
1. Implement service worker for full offline use/caching

## FAQ

### Why do some items not show a unit?

No nutrient was found listed with these items (or if the requested nutrient's
indicated API-supplied unit was not found to be the same as the API-supplied
unit for the food (though this presumably should not occur)).

### Why not run off the live API?

We were trying for a dual offline-online version, but there are
some problems with this:

1. Required an API key by the user
1. Required usage of a significant amount of API data: ~25MB.
1. Require a number of requests to get all of the food data (50 requests
    of a full 200 items' load of metadata)
1. Would be sluggish for the user

Our build script uses the API, however, so feel free to request
periodic updates if we are behind schedule and changes have been made.

## Ideas for longer term

3D world to go shopping and show foods and their amounts that can make
a deficiency.

Like to get (or lose) so many grams of Vitamin C, you can take 10 oranges,
5 lemons, 20 watermeons, and the opposite if drinking 2 Coca Colas,
smoking 5 cigarrettes, etc.

I am thinking the user could choose to pile them so they look to scale
(easier to judge for shopping) or an option to just show the numbers.
