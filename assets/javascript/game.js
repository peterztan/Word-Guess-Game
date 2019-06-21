

var songNames =
    [
            "feeling",
            "perspective",
            "pashunfruit",
    ];

var songPaths =
    [
        "idealismAP",
        "pashunFruit",
        "tooGood",
    ];

var imgPaths =
    [
        "idealismAP",
        "jsanFeeling",
        "pashunFruit",
    ];

const maxTries = 10;

var triedLetters = [];
var currentWordIdx;
var currentWord;
var currentGuess = [];
var guessesRemaining = 0;
var isgameStart = true; // default to game start since this is set on load
var isgameEnd = false;
var wins = 0;
var losses = 0;
var placeHolder = " _ "; // no need to concatenate here

function gameReset() {
    guessesRemaining = maxTries;
    isgameStart = false;

    // added minus one, since lenth is the total number of items in the array
    // eg. length is 3, but your index start on 0, from 0 -> 3 are actually 4 items
    // so you max random number is 4 which will be and undefined index.
    currentWordIdx = Math.floor(Math.random() * (songNames.length - 1));
    currentWord = songNames[currentWordIdx];
    console.log(currentWordIdx, currentWord);

    triedLetters = [];
    currentGuess = [];

    document.getElementById("songImage").src = "./assets/images/lowfiChill.jpg";
    document.getElementById("hangmanImage").src = "";
    document.getElementById("currentSong").src = "./assets/musics/sampleStart.mp3";

    for (var i = 0; i < currentWord.length; i++) {
        currentGuess.push(placeHolder);
    }

    // cssText set multiple style, but it has to parse a string into styles
    // if you are updating just one prop, doing it directly should more performant,
    // since there is no parsing involved, but is is just my opinion.
    // document.getElementById("pressKeyTryAgain").style.display = "none";
    document.getElementById("pressKeyTryAgain").style.cssText = "display: none";

    updateDisplay();
};

function updateDisplay() {
    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
    document.getElementById("current").innerText = "";

    for (var i = 0; i < currentGuess.length; i++) {
      document.getElementById("current").innerText += currentGuess[i];
    }

    document.getElementById("guessesRemaining").innerText = guessesRemaining;
    document.getElementById("triedLetters").innerText = triedLetters;
}

function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "./assets/images/hangman/" + (maxTries - guessesRemaining) + ".jpg";
};

document.onkeydown = function(event) {
  // use isgameStart to identiry first load... that is the beggining of the game
  if (isgameStart) {
    isgameStart = false
    document.getElementById('start-game').remove()
    return gameReset()
  }

  if (isgameEnd) {
    isgameEnd = false;
    return gameReset();
  }

  if (event.keyCode >= 65 && event.keyCode <= 90) {
    makeGuess(event.key.toLowerCase());
  }
}

function makeGuess (letter) {
    if (guessesRemaining > 0) {
        if (triedLetters.indexOf(letter) === -1) {
            triedLetters.push(letter);
            examineGuess(letter);
        }
    }
    updateDisplay();
};

function examineGuess(letter) {
    var letterPositions = [];

    for (var i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            letterPositions.push(i);
        }
    }

    if (letterPositions.length <= 0) {
      guessesRemaining--;
      updateHangmanImage();
    } else {
      for (var i = 0; i < letterPositions.length; i++) {
        currentGuess[letterPositions[i]] = letter;
      }
    }

    checkStatus();
};

// check status for both win or lose
function checkStatus() {
    if (currentGuess.indexOf(placeHolder) === -1) {
      isgameEnd = true;
      wins++;
      document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
      document.getElementById('game-status').innerHTML = '<h2>You Win</h2>'
    } else if (!guessesRemaining) {
      isgameEnd = true;
      losses++;
      document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
      document.getElementById('game-status').innerHTML = '<h2>You Lose</h2>'
    }
}

//could not figure out how to functionally and dynamically construct the image and audio file path//
