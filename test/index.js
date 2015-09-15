'use strict';

var fs = require('fs');
var test = require('tape');
var IntentUtteranceParser = require('../index');

test('parser', function(t) {
  t.plan(2);

  var fileStream = fs.createReadStream(__dirname + '/IntentUtterances.txt');

  IntentUtteranceParser(fileStream, function(error, response) {
    t.equal(error, null);
    t.equal(Array.isArray(response), true);
    t.equal(response.length, 2);
    t.equal(response[0].intentName, 'GetHoroscope');
    t.equal(response[1].intentName, 'GetLuckyNumbers');
    t.equal(response[0].slots, []);
    t.equal(response[1].slots, []);

    if (error) {
      console.error(error);
    } else {
      console.log('--------');
      console.log(JSON.stringify(response, null, 2));
    }
  });
});
