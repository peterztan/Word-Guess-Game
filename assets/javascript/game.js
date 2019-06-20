

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
        "idealismAT",
        "jsanFeeling",
        "pashunFruit",
    ];

const maxTries = 10;

var triedLetters = [];
var currentWord;
var currentGuess = [];
var guessesRemaining = 0;
var isgameStart = false;
var isgameEnd = false;
var wins = 0;
var placeHolder = " " + "_" + " ";

function gameReset() {
    guessesRemaining = maxTries;
    isgameStart = false;

    currentWord = Math.floor(Math.random() * (songNames.length));

    triedLetters = [];
    currentGuess = [];

    document.getElementById("songImage").src = "./assets/images/lowfiChill.jpg";
    document.getElementById("hangmanImage").src = "";
    document.getElementById("currentSong").src = "./assets/musics/sampleStart.mp3";

    for (var i = 0; i < songNames[currentWord].length; i++) {
        currentGuess.push(placeHolder);
    }

    document.getElementById("pressKeyTryAgain").style.cssText= "display: none";

    updateDisplay();
};

function updateDisplay() {

    document.getElementById("wins").innerText = wins;
    document.getElementById("current").innerText = "";
    for (var i = 0; i < currentGuess.length; i++) {
        document.getElementById("current").innerText += currentGuess[i];
   }
    document.getElementById("guessesRemaining").innerText = guessesRemaining;
    document.getElementById("triedLetters").innerText = triedLetters;
    if (guessesRemaining <= 0) {
            document.getElementById("pressKeyTryAgain").style.cssText = "display: none";
            isgameEnd = true;
    }
}

function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "./assets/images/hangman/" + (maxTries - guessesRemaining) + ".jpg";
};

document.onkeydown = function(event) {
    if (isgameEnd) {
        gameReset();
        isgameEnd = false;
    } else {
        if (event.keyCode >= 65 && event.keyCode <= 90) {
            makeGuess(event.key.toLowerCase());
        }
    }
}

function makeGuess (letter) {
    if (guessesRemaining > 0) {
        if (!isgameStart) {
            isgameStart = true;
        }

        if (triedLetters.indexOf(letter) === -1) {
            triedLetters.push(letter);
            examineGuess(letter);
        }
    }

    updateDisplay();
    checkWin();
};

function examineGuess(letter) {
    var letterPositions = [];

    for (var i = 0; i < songNames[currentWord].length; i++) {
        if (songNames[currentWord][i] === letter) {
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
};

function checkWin() {
    if (currentGuess.indexOf(placeHolder) === -1) {

        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        isgameEnd = true;
    }
}