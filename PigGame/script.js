'use strict';
//selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//setting score to 0
score0El.textContent = 0;
score1El.textContent = 0;

//variables
let scores = [0, 0];
let currentScore = 0;
let activePlayer = 0;
let playing = true;

//fucntions
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;

  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

//hiding the dice
diceEl.classList.add('hidden');

btnRoll.addEventListener('click', function () {
  if (playing == false) {
    return -1;
  }
  // 1. Generate number
  const dice = Math.trunc(Math.random() * 6) + 1;

  // 2. Display dice
  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${dice}.png`;
  // 3. Check for rolled 1
  if (dice !== 1) {
    //Add dice to current score
    currentScore += dice;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
  } else {
    //Switch Player
    switchPlayer();
  }
});

btnHold.addEventListener('click', function () {
  if (playing == false) {
    return -1;
  }
  //1. Add current score to the active player
  scores[activePlayer] += currentScore;
  document.querySelector(`#score--${activePlayer}`).textContent =
    scores[activePlayer];

  //2. Check score if its >= 100
  if (scores[activePlayer] >= 100) {
    playing = false;
    //3. Finish game
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner', 'name');

    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove('player--active');
  }
  //4. Switch the player on hold
  switchPlayer();
});

btnNew.addEventListener('click', function () {
  playing = true;

  scores = [0, 0];
  score0El.textContent = 0;
  score1El.textContent = 0;
  currentScore = 0;
  activePlayer = 0;

  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
});
