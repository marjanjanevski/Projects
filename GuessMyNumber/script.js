'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = document.querySelector('.guess').value;

  console.log(guess);

  if (!guess) {
    displayMessage('No Number');
  } else if (guess == secretNumber) {
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    displayMessage('Correct Number!!!');
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? 'Too High!' : 'Too Low!');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('You lost the game!');
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  //RESETING VARIABLES TO ORIGINAL VALUES
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;

  //STYLE TO ORIGINAL
  displayMessage('Start guessing');
  document.querySelector('.number').textContent = '?';
  document.querySelector('.score').textContent = score;
  document.querySelector('body').style.backgroundColor = '#222';
  const guess = (document.querySelector('.guess').value = '');
});
