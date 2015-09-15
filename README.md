# Intent Utterance File Parser

> Parse an intent utterance file, similar to the [Alexa Skills Kit Sample Utterance file](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface).

# Install

```bash
npm install intent-utterance-file-parser
```

# Usage

`IntentUtterances.txt`

```text
GetHoroscope what is the horoscope for {pisces|Sign}
GetHoroscope what will the horoscope for {leo|Sign} be {next tuesday|Date}
GetHoroscope get me my horoscope
GetHoroscope {gemini|Sign}

GetLuckyNumbers what are my lucky numbers
GetLuckyNumbers tell me my lucky numbers
```

Parsing example

```javascript
const fs = require('fs');
const IntentUtteranceParser = require('intent-utterance-file-parser');

const fileStream = fs.createReadStream(__dirname + '/IntentUtterances.txt');

IntentUtteranceParser(fileStream, function(error, response) {
  if (error) {
    console.error(error);
    return false;
  }

  console.log(response);
  /*
  [
    {
      "intent": "GetHoroscope",
        "slots": [
        {
          "name": "Sign",
          "type": "LITERAL"
        },
        {
          "name": "Date",
          "type": "LITERAL"
        }
        ],
          "words": [
          "be",
          "for",
          "get",
          "horoscope",
          "is",
          "me",
          "my",
          "the",
          "what",
          "will"
          ]
    },
    {
      "intent": "GetLuckyNumbers",
      "slots": [],
      "words": [
      "are",
      "lucky",
      "me",
      "my",
      "numbers",
      "tell",
      "what"
      ]
    }
  ]
  */

});
```

# License

MIT
