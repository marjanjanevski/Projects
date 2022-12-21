'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// DISPLAYING THE WITHDRAWALS AND DEPOSTITS
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const sorting = sort ? movements.slice().sort((a, b) => a - b) : movements;

  sorting.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);
//DISPLAYING THE WITHDRAWALS AND DEPOSTITS ---------------------------------------------

//CREATING USERNAMES BY JOINING THE FIRST LETTERS IN NAME AND SURNAME
const createUsers = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};

createUsers(accounts);
// console.log(accounts);
//CREATING USERNAMES BY JOINING THE FIRST LETTERS IN NAME AND SURNAME--------------------------------------------------
//CALCULATING AND DISPLAYING BALANCE
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//CALCULATING AND DISPLAYING BALANCE---------------------------------------------------------

//CALC DISPLAYING SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const withdraws = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${withdraws}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interests => interests > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
};

//CALC DISPLAYING SUMMARY--------------------------------------------------------------------

//LOGIN USER

const updateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  //DISPLAY BALANCE
  calcBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    updateUI(currentAccount);
  }
});

//LOGIN USER----------------------------------------------------------------------

//TRANSFER MONEY

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance > amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount);
  } else {
    console.log(`invalid transfer`);
  }

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

//TRANSFER MONEY-------------------------------------------------------------------

//LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
  } else {
    alert('You are not eligble to take a loan');
  }

  updateUI(currentAccount);

  inputLoanAmount.value = '';
});

//LOAN-------------------------------------------------------------------------------

//CLOSE ACC

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

//CLOSE ACC----------------------------------------------------------------

//SORTING MOVEMENTS

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//SORTING MOVEMENTS ---------------------------------------------------------
/////////////////////////////////////////////////

const m = new Array(7);
console.log(m.fill(1));

console.log(movements.includes(-130));

console.log(movements.some(mov => mov > 0));

console.log(movements.every(mov => mov > 0));

const accMovements = accounts.map(acc => acc.movements);

//flat
console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .reduce((acc, mov) => acc + mov),
  0
);

//flat map
console.log(
  accounts
    .map(acc => acc.movements)
    .flatMap(acc => acc, movements)
    .reduce((acc, mov) => acc + mov),
  0
);

const owners = ['Makco', 'Zac', 'Martha', 'Ada'];
console.log(owners.sort());

const eurToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return Math.trunc(mov * eurToUsd);
});

const arrowMovementsUSD = movements.map(mov => mov * eurToUsd); //ARROW FUNCTION SAME RESULT AS ^

// console.log(movements);
// console.log(movementsUSD, '$');

const movementDesc = movements.map(function (mov, i) {
  if (mov > 0) {
    return `Movement ${i}: You deposited ${mov}`;
  } else {
    return `Movement ${i}: You withdraw ${mov}`;
  }
});

console.log(movementDesc);

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// let arr = ['a', 'b', 'c', 'd', 'e'];

// //slice doesnt mutate the original array
// console.log(arr.slice(2, 4));

// //splice mutates original array
// console.log(arr.splice(2));

// let arr2 = ['j', 'i', 'h', 'g', 'f'];
// //REVERSE
// console.log(arr2.reverse());

// //CONCAT

// const letter = arr.concat(arr2);
// console.log(letter);

// const arr = [23, 11, 64];

// console.log(arr[0]);
// 1;
// console.log(arr.at(-1));

// movements.forEach(function (movement, index) {
//   if (movement > 0) {
//     console.log(`Movement ${index}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${index}: You withdraw ${movement}`);
//   }
// });

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// const balance = movements.reduce(function (acc, cur) {
//   return acc + cur;
// }, 0);

// // console.log(balance);

//CHALLANGE;

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [9, 16, 6, 8, 3];

const checkDogs = function (dogsJulia, dogsKate) {
  const juliaDogsCorrect = dogsJulia.slice();
  juliaDogsCorrect.splice(0, 1);
  juliaDogsCorrect.splice(-2);
  // console.log(juliaDogsCorrect);

  const combineDogs = juliaDogsCorrect.concat(dogsKate);
  // console.log(combineDogs);

  combineDogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy ${dog} years old`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [9, 16, 6, 8, 3]);

//CHALLANGE 2

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAges);
  const dogAdults = humanAges.filter(age => age >= 18);
  console.log(dogAdults);

  const averageDogYears =
    dogAdults.reduce((acc, age) => acc + age, 0) / dogAdults.length;
  console.log(averageDogYears);
};

calcAverageHumanAge([5, 3, 2, 1, 2]);
calcAverageHumanAge([5, 3, 2, 1, 5, 6, 1, 13, 2]);

// const totalDeposti = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(Math.trunc(totalDeposti));
//1 exercise
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositSum, 'Has been deposited in total in the bank');

//2 exercise
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);
// .filter(mov => mov >= 1000).length;

console.log(numDeposits1000);

//3 exercise
const { deposit, withdraws } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposit += cur) : (sums.withdraws += cur);
      return sums;
    },
    { deposit: 0, withdraws: 0 }
  );

console.log(deposit, withdraws);

//4 exercise
const convertTitleCase = function (title) {
  const exception = ['a', 'the', 'but'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exception.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return titleCase;
};
console.log(convertTitleCase(`this is a nice title`));
console.log(convertTitleCase(`this is a long title but not too long`));

const dogs = [
  {
    weight: 22,
    curFood: 250,
    owners: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curFood: 200,
    owners: ['Matilda'],
  },
  {
    weight: 13,
    curFood: 275,
    owners: ['Sarah', 'John'],
  },
  {
    weight: 32,
    curFood: 340,
    owners: ['Michael'],
  },
];

//1
dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  console.log(dog.recommendedFood);
});

//2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

//3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);

//4
console.log(`${ownersEatTooMuch.join(' and ')} and eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')} and eat too much`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

const checkEatingOkay = dog =>
  dog.curFood >= dog.recommendedFood * 0.9 &&
  dog.curFood <= dog.recommendedFood * 1.1;

//6
console.log(dogs.some(checkEatingOkay));

//7
console.log(dogs.filter(checkEatingOkay));

//8
const copyDogsArray = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(copyDogsArray);
