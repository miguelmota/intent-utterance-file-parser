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
    const getWords = IntentUtteranceParser._getWords;
    const getSlots = IntentUtteranceParser._getSlots;
    const getUnique = IntentUtteranceParser._getUnique;

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
                utterances: []
              };
            }

            intentsHash[intentName].intent = intentName;
            intentsHash[intentName].utterances.push(getWords(tokens));
            intentsHash[intentName].slots = intentsHash[intentName].slots.concat(
                    getSlots(tokens));
          }

        }
      }
    }

    for (var intent in intentsHash) {
      response.push(intentsHash[intent]);
    }

    function getUniqueSlots(obj) {
      obj.slots = getUnique(obj.slots, 'name');
      return obj;
    }

    const filteredResponse = _.chain(response).map(getUniqueSlots).value();

    callback(error, filteredResponse);
  }).on('error', function(error) {
    callback(error);
  });
}

/**
 * getWords
 * @param {array} words - array of words
 */
IntentUtteranceParser._getSlots = function(words) {
  const getSlotName = IntentUtteranceParser._getSlotName;
  const isNotEmpty = IntentUtteranceParser._isNotEmpty;

  if (!_.isArray(words)) {
    return [];
  }

  function getSlotObject(word) {
    const slotName = getSlotName(word);

    if (_.isString(slotName)) {
      return {
        name: slotName,
        type: 'LITERAL'
      };
    }
    return null;
  }

  return _.chain(words).map(getSlotObject).filter(isNotEmpty).value();
};

/**
 * getSlotName
 * @param {string} word - word
 */
IntentUtteranceParser._getSlotName = function(word) {
  if (!_.isString(word)) {
    return null;
  }

  const slotName = /^\{.*\|\s*(\w+)\s*\}$/i;
  const matches = word.match(slotName);

  if (_.isArray(matches) && matches[1]) {
    return matches[1];
  }

  return null;
};

/**
 * isWithinBraces
 * @param {string} word - word
 */
IntentUtteranceParser._isWithinBraces = function(word) {
  const withinBraces = /^\{.*\}$/gi;
  return withinBraces.test(word);
};

IntentUtteranceParser._notEmpty = function(word) {
  return !_.isEmpty(word);
};

/**
 * getWords
 * @param {array} words - array of words
 */
IntentUtteranceParser._getWords = function(words) {
  const getWordsFromSlot = IntentUtteranceParser._getWordsFromSlot;
  const isWord = IntentUtteranceParser._isWord;

  if (!_.isArray(words)) {
    return [];
  }

  return _.chain(words).reduce(getWordsFromSlot, words).filter(isWord).value();
};

/**
 * isWord
 * @param {string} word - word
 */
IntentUtteranceParser._isWord = function(word) {
  const wordOnlyRegex = /^\w+$/gi;
  return wordOnlyRegex.test(word);
};

/**
 * getWordsFromSlot
 * @desc reducer
 * @param {array} acc - accumulator
 * @param {string} word - word
 */
IntentUtteranceParser._getWordsFromSlot = function(acc, word) {
  const wordsOnlyRegex = /[^\s^]+[^\s+]/gi;
  const wordStringFromSlotRegex = /^\{(.*)\|.*\}$/i;
  const slotWordsMatch = word.match(wordStringFromSlotRegex);

  if (_.isArray(slotWordsMatch) && slotWordsMatch[1]) {
    const slotWords = slotWordsMatch[1].match(wordsOnlyRegex);
    if (_.isArray(slotWords)) {
      acc = acc.concat(slotWords);
    }
  }

  return acc;
};

/**
 * getUnique
 * @param {array} words - array of words
 */
IntentUtteranceParser._getUnique = function(array, options) {
  return _.unique(array, options);
};


IntentUtteranceParser.getUniqueWords = function(col) {
  return _.chain(col).reduce(function(acc, obj) {
    return acc.concat(obj.utterances);
  }, []).flatten().unique().value();
};

module.exports = IntentUtteranceParser;
