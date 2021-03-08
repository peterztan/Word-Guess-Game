"use strict";
var SONG_LIB = [
    {
        name: "perspective",
        SONG_PATH: "idealismAP",
        IMAGE_PATH: "idealismAP",
    },
    {
        name: "pashunfruit",
        SONG_PATH: "pashunFruit",
        IMAGE_PATH: "pashunFruit",
    },
    {
        name: "feeling",
        SONG_PATH: "tooGood",
        IMAGE_PATH: "jsanFeeling",
    },
];
var maxTries = 10;
var triedLetters = [];
var currentWord = "";
var currentGuess = [];
var guessesRemaining = 0;
var isGameStart = true;
var isGameEnd = false;
var wins = 0;
var losses = 0;
var placeHolder = " _ ";
var songImage = document.getElementById("song-image");
var songAudio = document.getElementById("current-song");
songAudio.volume = 0.25;
var gameStatusDiv = document.getElementById("game-status");
var tryAgainDiv = document.getElementById("try-again");
var startGameDiv = document.getElementById("start-game");
var winsDiv = document.getElementById("wins");
var lossesDiv = document.getElementById("losses");
var currentWordDiv = document.getElementById("current");
var guessesRemainingDiv = document.getElementById("guesses-remaining");
var triedLettersDiv = document.getElementById("tried-letters");
var hangmanImage = document.getElementById("hangman-image");
function setMedia(idx) {
    var img = "./assets/images/" + SONG_LIB[idx].IMAGE_PATH + ".jpg";
    var song = "./assets/musics/" + SONG_LIB[idx].SONG_PATH + ".mp3";
    songImage.src = img;
    songAudio.pause();
    songAudio.setAttribute("src", song);
    songAudio.load();
    songAudio.play();
}
function gameReset() {
    guessesRemaining = maxTries;
    isGameStart = false;
    var currentWordIdx = Math.floor(Math.random() * SONG_LIB.length);
    currentWord = SONG_LIB[currentWordIdx].name;
    triedLetters = [];
    currentGuess = [];
    hangmanImage.src = "";
    for (var i = 0; i < currentWord.length; i++) {
        currentGuess.push(placeHolder);
    }
    tryAgainDiv.style.cssText = "display: none";
    setMedia(currentWordIdx);
    updateDisplay();
    updateGameAnnouncement();
}
function updateDisplay() {
    winsDiv.innerText = wins.toString();
    lossesDiv.innerText = losses.toString();
    currentWordDiv.innerText = "";
    for (var i = 0; i < currentGuess.length; i++) {
        currentWordDiv.innerText += currentGuess[i];
    }
    guessesRemainingDiv.innerText = guessesRemaining.toString();
    triedLettersDiv.innerText = triedLetters.toString();
}
function updateGameAnnouncement() {
    gameStatusDiv.innerHTML = "";
}
function updateHangmanImage() {
    hangmanImage.src =
        "./assets/images/hangman/" + (maxTries - guessesRemaining) + ".jpg";
}
document.onkeydown = function (event) {
    var keyPattern = /[A-Za-z]/;
    if (isGameStart) {
        isGameStart = false;
        startGameDiv.remove();
        return gameReset();
    }
    if (isGameEnd) {
        isGameEnd = false;
        return gameReset();
    }
    if (keyPattern.test(event.key) && event.key.length === 1) {
        makeGuess(event.key.toLowerCase());
    }
};
function makeGuess(letter) {
    if (guessesRemaining > 0) {
        if (triedLetters.indexOf(letter) === -1) {
            triedLetters.push(letter);
            examineGuess(letter);
        }
    }
    updateDisplay();
}
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
    }
    else {
        for (var i = 0; i < letterPositions.length; i++) {
            currentGuess[letterPositions[i]] = letter;
        }
    }
    checkStatus();
}
function checkStatus() {
    if (currentGuess.indexOf(placeHolder) === -1) {
        isGameEnd = true;
        wins++;
        tryAgainDiv.style.cssText = "display: block";
        gameStatusDiv.innerHTML = "<h2>You Win</h2>";
    }
    else if (!guessesRemaining) {
        isGameEnd = true;
        losses++;
        tryAgainDiv.style.cssText = "display: block";
        gameStatusDiv.innerHTML = "<h2>You Lose</h2>";
    }
}
