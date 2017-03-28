'use strict';

var _       = require('lodash'),
    Pokedex = require('pokedex-promise-v2');

module.exports = (function() {
  
  var Dexter = (function() {

    function Dexter(alexa) {
      // Loop through all the properties of the class and re-assign the functions to bind "this" to maintain scope throughout.
      _.forOwn(proto, function(value, key) {
        if(_.isFunction(proto[key])) {
          proto[key] = proto[key].bind(this);
        }
      }.bind(this));
      proto._pokedex = new Pokedex();
    }

    var proto = {
      // Constants
      // ---------

      languageStrings:  {
        "WELCOME_MESSAGE":            "<speak><p><s>Hello!</s><s> I am Dexter.</s><s>Try stating a command like...</s><s>Tell Dexter to look up Pikachu.</s></p></speak>",
        "POKEMON_NOT_FOUND_MESSAGE":  "I\'m sorry, I could not locate that Pokémon in my memory bank."
      },

      
      // Variables
      // ---------
      _assistant:   "",
      _pokemonName: "",
      _pokedex:     null,


      // Handlers
      // ---------
      mainHandler: function(assistant) {
        console.log("Entered mainHandler");
        assistant.tell(this.languageStrings.WELCOME_MESSAGE);
      },

      pokedexHandler: function (assistant) {
        console.log("Entered pokedexHandler ---- The raw input is: " + assistant.getRawInput());
        this._pokemonName = assistant.getArgument("pokemon").toLowerCase(),
        this._assistant = assistant;
        console.log("The pokemon name is: " + this._pokemonName);
        this._pokedex.getPokemonSpeciesByName(this._pokemonName)
        .then(this._onPokemonFound)
        .catch(this._onPokemonError);
      },


      // Event Handlers
      // --------------
      _onPokemonFound: function(response) {
        var pokedexEntry = null,
            pokedexData = "";
            
        if(response && response.flavor_text_entries && response.flavor_text_entries.length > 0) {
          pokedexEntry = _.find(response.flavor_text_entries, function(entry) {
            return entry.language.name === "en" && entry.version.name === "blue";
          });

          pokedexData = "<speak><p><s>Pokédex info for " + this._pokemonName + ". </s><s>" + pokedexEntry.flavor_text + "</s></speak>";
          // Remove new lines and tabs.
          while(pokedexData.indexOf("\n") > -1) {
            pokedexData = _.replace(pokedexData, "\n", " ");
          }
          while(pokedexData.indexOf("\f") > -1) {
            pokedexData = _.replace(pokedexData, "\f", " ");
          }
          this._assistant.tell(pokedexData);
        }
        else {
          this._assistant.tell("No data exists for " + this._pokemonName + ".");
        }
      },

      _onPokemonError: function(error) {
        if(this._pokemonName !== "") {
          this._assistant.tell("No data exists for " + this._pokemonName + ".");
        }
        else {
          this._assistant.tell(this.languageStrings.POKEMON_NOT_FOUND_MESSAGE);
        }
      }

    }

    Dexter.prototype = proto;
    return Dexter;

  })();

  return Dexter;

})();