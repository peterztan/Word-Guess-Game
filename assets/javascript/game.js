

var songNames =
    [
      "perspective",
      "pashunfruit",
      "feeling",
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
        "pashunFruit",
        "jsanFeeling",
    ];

const maxTries = 10;

var triedLetters = [];
var currentWord;
var currentGuess = [];
var guessesRemaining = 0;
// use it to indicat that is the start of the game since this is set on load
var isgameStart = true;
var isgameEnd = false;
var wins = 0;
var losses = 0;
var placeHolder = " _ "; // no need to concatenate here

var songImage = document.getElementById('songImage')
var audio = document.getElementById('currentSong')
audio.volume = 0.25;

/**
 * Set image and audio dynamically basesed on the selected random word
 * @param {int} idx   The index corresponding to the media array element.
 * @return void
 */
function setMedia (idx) {
  var img = './assets/images/' + imgPaths[idx] + '.jpg';
  var song = './assets/musics/' + songPaths[idx] + '.mp3';

  songImage.src = img;

  audio.pause();
  audio.setAttribute('src', song);
  audio.load();
  audio.play();
}

function gameReset() {
    guessesRemaining = maxTries;
    isgameStart = false;

    var currentWordIdx = Math.floor(Math.random() * (songNames.length));
    currentWord = songNames[currentWordIdx];

    triedLetters = [];
    currentGuess = [];

    document.getElementById("hangmanImage").src = "";

    for (var i = 0; i < currentWord.length; i++) {
        currentGuess.push(placeHolder);
    }

    // cssText set multiple style, but it has to parse a string into styles
    // if you are updating just one prop, doing it directly should more performant,
    // since there is no parsing involved, but is is just my opinion.
    // document.getElementById("pressKeyTryAgain").style.display = "none";
    document.getElementById("pressKeyTryAgain").style.cssText = "display: none";

    setMedia(currentWordIdx)

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

