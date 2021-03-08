interface Song {
  name: string;
  SONG_PATH: string;
  IMAGE_PATH: string;
}

const SONG_LIB: Song[] = [
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

const maxTries: number = 10;

let triedLetters: string[] = [];
let currentWord: string = "";
let currentGuess: string[] = [];
let guessesRemaining: number = 0;
// use it to indicate that is the start of the game since this is set on load
let isGameStart: boolean = true;
let isGameEnd: boolean = false;
let wins: number = 0;
let losses: number = 0;
const placeHolder: string = " _ "; // no need to concatenate here

const songImage: HTMLImageElement = document.getElementById(
  "song-image"
) as HTMLImageElement;
const songAudio: HTMLAudioElement = document.getElementById(
  "current-song"
) as HTMLAudioElement;
songAudio.volume = 0.25;

const gameStatusDiv: HTMLDivElement = document.getElementById(
  "game-status"
) as HTMLDivElement;
const tryAgainDiv: HTMLDivElement = document.getElementById(
  "try-again"
) as HTMLDivElement;
const startGameDiv: HTMLDivElement = document.getElementById(
  "start-game"
) as HTMLDivElement;
const winsDiv: HTMLDivElement = document.getElementById(
  "wins"
) as HTMLDivElement;
const lossesDiv: HTMLDivElement = document.getElementById(
  "losses"
) as HTMLDivElement;
const currentWordDiv: HTMLDivElement = document.getElementById(
  "current"
) as HTMLDivElement;
const guessesRemainingDiv: HTMLDivElement = document.getElementById(
  "guesses-remaining"
) as HTMLDivElement;
const triedLettersDiv: HTMLDivElement = document.getElementById(
  "tried-letters"
) as HTMLDivElement;
const hangmanImage: HTMLImageElement = document.getElementById(
  "hangman-image"
) as HTMLImageElement;

/**
 * Set image and audio dynamically basesed on the selected random word
 * @param idx The index corresponding to the media array element.
 * @return void
 */
function setMedia(idx: number): void {
  const img: string = "./assets/images/" + SONG_LIB[idx]!.IMAGE_PATH + ".jpg";
  const song: string = "./assets/musics/" + SONG_LIB[idx]!.SONG_PATH + ".mp3";

  songImage.src = img;

  songAudio.pause();
  songAudio.setAttribute("src", song);
  songAudio.load();
  songAudio.play();
}

function gameReset(): void {
  guessesRemaining = maxTries;
  isGameStart = false;

  const currentWordIdx: number = Math.floor(Math.random() * SONG_LIB.length);
  currentWord = SONG_LIB[currentWordIdx]!.name;

  triedLetters = [];
  currentGuess = [];

  hangmanImage.src = "";

  for (let i: number = 0; i < currentWord.length; i++) {
    currentGuess.push(placeHolder);
  }

  // cssText set multiple style, but it has to parse a string into styles
  // since there is no parsing involved, but is is just my opinion.
  // if you are updating just one prop, doing it directly should more performant,
  // document.getElementById("pressKeyTryAgain").style.display = "none";
  tryAgainDiv.style.cssText = "display: none";

  setMedia(currentWordIdx);

  updateDisplay();
  updateGameAnnouncement();
}

function updateDisplay(): void {
  winsDiv.innerText = wins.toString();
  lossesDiv.innerText = losses.toString();
  currentWordDiv.innerText = "";

  for (let i: number = 0; i < currentGuess.length; i++) {
    currentWordDiv.innerText += currentGuess[i];
  }

  guessesRemainingDiv.innerText = guessesRemaining.toString();
  triedLettersDiv.innerText = triedLetters.toString();
}

function updateGameAnnouncement(): void {
  gameStatusDiv.innerHTML = "";
}

function updateHangmanImage(): void {
  hangmanImage.src =
    "./assets/images/hangman/" + (maxTries - guessesRemaining) + ".jpg";
}

document.onkeydown = (event: KeyboardEvent): void => {
  // use isgameStart to identiry first load... that is the beggining of the game
  const keyPattern: RegExp = /[A-Za-z]/;

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

function makeGuess(letter: string): void {
  if (guessesRemaining > 0) {
    if (triedLetters.indexOf(letter) === -1) {
      triedLetters.push(letter);
      examineGuess(letter);
    }
  }
  updateDisplay();
}

function examineGuess(letter: string): void {
  const letterPositions: number[] = [];

  for (let i: number = 0; i < currentWord.length; i++) {
    if (currentWord[i] === letter) {
      letterPositions.push(i);
    }
  }

  if (letterPositions.length <= 0) {
    guessesRemaining--;
    updateHangmanImage();
  } else {
    for (let i: number = 0; i < letterPositions.length; i++) {
      currentGuess[letterPositions[i]!] = letter;
    }
  }

  checkStatus();
}

// check status for both win or lose
function checkStatus(): void {
  if (currentGuess.indexOf(placeHolder) === -1) {
    isGameEnd = true;
    wins++;
    tryAgainDiv.style.cssText = "display: block";
    gameStatusDiv.innerHTML = "<h2>You Win</h2>";
  } else if (!guessesRemaining) {
    isGameEnd = true;
    losses++;
    tryAgainDiv.style.cssText = "display: block";
    gameStatusDiv.innerHTML = "<h2>You Lose</h2>";
  }
}
