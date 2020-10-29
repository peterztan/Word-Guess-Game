

let songNames =
    [
      "perspective",
      "pashunfruit",
      "feeling",
    ];

let songPaths =
    [
        "idealismAP",
        "pashunFruit",
        "tooGood",
    ];

let imgPaths =
    [
        "idealismAP",
        "pashunFruit",
        "jsanFeeling",
    ];

const maxTries = 10;

let triedLetters = [];
let currentWord;
let currentGuess = [];
let guessesRemaining = 0;
// use it to indicat that is the start of the game since this is set on load
let isgameStart = true;
let isgameEnd = false;
let wins = 0;
let losses = 0;
let placeHolder = " _ "; // no need to concatenate here

let songImage = document.getElementById('songImage')
let audio = document.getElementById('currentSong')
audio.volume = 0.25;

/**
 * Set image and audio dynamically basesed on the selected random word
 * @param {int} idx   The index corresponding to the media array element.
 * @return void
 */
setMedia = (idx) => {
  let img = './assets/images/' + imgPaths[idx] + '.jpg';
  let song = './assets/musics/' + songPaths[idx] + '.mp3';

  songImage.src = img;

  audio.pause();
  audio.setAttribute('src', song);
  audio.load();
  audio.play();
}

gameReset = () => {

    guessesRemaining = maxTries;
    isgameStart = false;

    let currentWordIdx = Math.floor(Math.random() * (songNames.length));
    currentWord = songNames[currentWordIdx];

    triedLetters = [];
    currentGuess = [];

    document.getElementById("hangmanImage").src = "";

    for (let i = 0; i < currentWord.length; i++) {
        currentGuess.push(placeHolder);
    }

    // cssText set multiple style, but it has to parse a string into styles
    // since there is no parsing involved, but is is just my opinion.
    // if you are updating just one prop, doing it directly should more performant,
    // document.getElementById("pressKeyTryAgain").style.display = "none";
    document.getElementById("pressKeyTryAgain").style.cssText = "display: none";

    setMedia(currentWordIdx)

    updateDisplay();
    updateGameAnnouncement();
};

updateDisplay = () => {
    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
    document.getElementById("current").innerText = "";

    for (let i = 0; i < currentGuess.length; i++) {
      document.getElementById("current").innerText += currentGuess[i];
    }

    document.getElementById("guessesRemaining").innerText = guessesRemaining;
    document.getElementById("triedLetters").innerText = triedLetters;
}

updateGameAnnouncement = () => {
    document.getElementById("game-status").innerHTML = "";
}

updateHangmanImage = () => {
    document.getElementById("hangmanImage").src = "./assets/images/hangman/" + (maxTries - guessesRemaining) + ".jpg";
};

document.onkeydown = (event) => {
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

makeGuess = (letter) => {
    if (guessesRemaining > 0) {
        if (triedLetters.indexOf(letter) === -1) {
            triedLetters.push(letter);
            examineGuess(letter);
        }
    }
    updateDisplay();
};

examineGuess = (letter) => {
    let letterPositions = [];

    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            letterPositions.push(i);
        }
    }

    if (letterPositions.length <= 0) {
      guessesRemaining--;
      updateHangmanImage();
    } else {
      for (let i = 0; i < letterPositions.length; i++) {
        currentGuess[letterPositions[i]] = letter;
      }
    }

    checkStatus();
};

// check status for both win or lose
checkStatus = () => {
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

