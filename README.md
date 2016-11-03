# Pokename
Generates pokemon names based on version numbers (similar to Ubuntu code names). It was mainly made as a demo for Backbone.js and CoffeeScript




### Live version
https://smichal52.github.io/Pokename/




### Usage
Click generate to generate a name, checkbox on the left toggles between random and sequential mode.

On random mode, both the pokemon name and adjective are picked randomly, otherwise they are generated based on the version number
(Nature is always random).




### UI explanation
###### Upper part (left to right):
* Generation Mode checkbox, this toggles between between sequential and random generation
* Version number input, this can be entered mannually (filtered to only allow numbers and dot) but is also generated sequentially after each version generation
* Generate button, generated the poke-name for current version (also works with enter), each new item is added to the top of the table (with green color)
* Sort table button, sort table based on the name field (also happens every time you reload the page)
* Clear table button, removes the entire collection (from both the UI and storage) 

###### Lower part (table):
* Version, Adjective, Name, Nature, each of those can be edited by clicking it
* Remove, removes this item from the UI and the Collection
* Copy, copies Adjective and Name to clipboard




### Notes
* When the page loads, the entire pokedex is fetched from the pokemon api. This offers the ability to sort the pokemon and ensure that names are generated alphabetically (assuming increasing version numbers). In comparison, using an api call on each generation, not only prevents alphabetical selection, but also fetches a large extra amount of parameters for each pokemon which are not needed (pokedex only fetches name and a uri to it's resource)

* Name generation happens as follows. Version is split by dot character, first part corresponds to the name of the pokemon, while second part generates the adjective. That means that pokemon names, change only on major updates! (which makes sense) On each generation a pokemon nature is also randomly picked (just cosmetic).

* The adjective is picked by a compiled list of 200 sorted adjectives which was generated with an online tool, nature is handled similarly (just not sorted).

* When a stored poke-name item is edited, it turns green to let you identify it better, and also tell you that it might be out of sort now (like the newly generated ones)

* The UI is not exactly responsive, but there is a simple resize function that ads compact classes on some elements (on window resize), to ensure the app can be displayed properly on mobile (feel free to resize the browser to see)

