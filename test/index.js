'use strict';

const fs = require('fs');
const test = require('tape');
const IntentUtteranceParser = require('../index');

test('parser', function(t) {
  t.plan(14);

  const fileStream = fs.createReadStream(__dirname + '/IntentUtterances.txt');

  IntentUtteranceParser(fileStream, function(error, response) {
    // Error
    t.equal(error, null);

    // Response
    t.equal(Array.isArray(response), true);
    t.equal(response.length, 2);
    t.deepEqual(Object.keys(response[0]), ['intent', 'slots', 'utterances']);

    // Intent Name
    t.equal(typeof response[0].intent, 'string');
    t.equal(response[0].intent, 'GetHoroscope');
    t.equal(response[1].intent, 'GetLuckyNumbers');

    // Utterances
    const expectedUtterances0 = [
      [
        'what',
        'is',
        'the',
        'horoscope',
        'for',
        'pisces'
      ],
      [
        'what',
        'will',
        'the',
        'horoscope',
        'for',
        'be',
        'leo',
        'next',
        'tuesday'
      ],
      [
        'get',
        'me',
        'my',
        'horoscope'
      ],
      [
        'gemini'
      ]
    ];

    const expectedUtterances1 = [
      [
        'what',
        'are',
        'my',
        'lucky',
        'numbers'
      ],
      [
        'tell',
        'me',
        'my',
        'lucky',
        'numbers'
      ]
    ];

    t.equal(Array.isArray(response[0].utterances), true);
    t.deepEqual(response[0].utterances, expectedUtterances0);
    t.deepEqual(response[1].utterances, expectedUtterances1);

    // Slots
    const expectedSlots0 =  [
     {
       'name': 'Sign',
       'type': 'LITERAL'
     },
     {
       'name': 'Date',
       'type': 'LITERAL'
     }
   ];

    const expectedUniqueWords = [
      'what',
      'is',
      'the',
      'horoscope',
      'for',
      'pisces',
      'will',
      'be',
      'leo',
      'next',
      'tuesday',
      'get',
      'me',
      'my',
      'gemini',
      'are',
      'lucky',
      'numbers',
      'tell'
    ];

    t.equal(Array.isArray(response[0].slots), true);
    t.deepEqual(response[0].slots, expectedSlots0);
    t.deepEqual(response[1].slots, []);

    // Unique Words
    const uniqueWords = IntentUtteranceParser.getUniqueWords(response);

    t.deepEqual(uniqueWords, expectedUniqueWords);
  });
});
