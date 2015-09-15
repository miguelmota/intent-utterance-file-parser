'use strict';

const _ = require('lodash');

/**
 * IntentUtteranceParser
 * @param {object} fileStream
 */
function IntentUtteranceParser(fileStream, callback) {
  var data = '';

  fileStream.on('data', function(chunk) {
    data += chunk;
  }).on('end', function() {
    const error = null;
    const response = [];
    const lineContentRegex = /[^\n\r]+/gi;
    const lineMatches = data.match(lineContentRegex);
    const intentsHash = {};

    if (_.isArray(lineMatches)) {
      for (const lineMatch of lineMatches) {
        if (_.isString(lineMatch)) {
          const lineParts = lineMatch.match(/\{.*?\}+|[^[\s]+/gi);
          if (_.isArray(lineParts) && _.size(lineParts) > 0) {
            const intentName = lineParts[0];
            const tokens = lineParts.slice(1);

            if (!intentsHash[intentName]) {
              intentsHash[intentName] = {
                intent: null,
                slots: [],
                words: []
              };
            }

            intentsHash[intentName].intent = intentName;
            intentsHash[intentName].words = IntentUtteranceParser._getUnique(
                  intentsHash[intentName].words.concat(
                    IntentUtteranceParser._getWords(tokens)
                  )
            ).sort();

            intentsHash[intentName].slots = IntentUtteranceParser._getUnique(
                intentsHash[intentName].slots.concat(
                    IntentUtteranceParser._getSlots(tokens)
                ), 'name');
          }

        }
      }
    }

    for (var intent in intentsHash) {
      response.push(intentsHash[intent]);
    }

    callback(error, response);
  }).on('error', function(error) {
    callback(error);
  });
}

/**
 * getWords
 * @param {array} words - array of words
 */
IntentUtteranceParser._getSlots = function(words) {
  if (!_.isArray(words)) {
    return [];
  }

  function slotName(word) {
    if (!_.isString(word)) {
      return null;
    }

    const slotName = /^\{.*\|\s*(\w+)\s*\}$/i;
    const matches = word.match(slotName);

    if (_.isArray(matches) && matches[1]) {
      return {
        name: matches[1],
        type: 'LITERAL'
      };
    }

    return null;
  }

  function isWithinBraces(word) {
    const withinBraces = /^\{.*\}$/gi;
    return withinBraces.test(word);
  }

  function notEmpty(word) {
    return !_.isEmpty(word);
  }

  return _.chain(words).map(slotName).filter(notEmpty).value();
};

/**
 * getWords
 * @param {array} words - array of words
 */
IntentUtteranceParser._getWords = function(words) {
  if (!_.isArray(words)) {
    return [];
  }

  return _.filter(words, function(word) {
    const wordOnly = /^\w+$/gi;
    return wordOnly.test(word);
  });
};

/**
 * getUnique
 * @param {array} words - array of words
 */
IntentUtteranceParser._getUnique = function(array, options) {
  return _.unique(array, options);
};

module.exports = IntentUtteranceParser;
