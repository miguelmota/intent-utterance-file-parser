# Intent Utterance File Parser

> Parse an intent utterance file, like the [Alexa Skills Kit Sample Utterance file](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface).

The parser extracts words and slots from each intent.

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

File parsing

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
        "utterances": [
          [
            "what",
            "is",
            "the",
            "horoscope",
            "for",
            "pisces"
          ],
          [
            "what",
            "will",
            "the",
            "horoscope",
            "for",
            "be",
            "leo",
            "next",
            "tuesday"
          ],
          [
            "get",
            "me",
            "my",
            "horoscope"
          ],
          [
            "gemini"
          ]
        ]
      },
      {
        "intent": "GetLuckyNumbers",
        "slots": [],
        "utterances": [
          [
            "what",
            "are",
            "my",
            "lucky",
            "numbers"
          ],
          [
            "tell",
            "me",
            "my",
            "lucky",
            "numbers"
          ]
        ]
      }
    ]
  */

  console.log(IntentUtteranceParser.getUniqueWords(response));
  /*
    [
      "what",
      "is",
      "the",
      "horoscope",
      "for",
      "pisces",
      "will",
      "be",
      "leo",
      "next",
      "tuesday",
      "get",
      "me",
      "my",
      "gemini",
      "are",
      "lucky",
      "numbers",
      "tell"
    ]
  */
});
```

# License

MIT
