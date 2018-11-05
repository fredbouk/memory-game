(function(){

//shuffeling function
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//shuffles and updates cards on page
function shuffleCards() {
  //get all cards from the DOM
  const allCards = document.querySelectorAll('.card')

  //reset the cards classes
  allCards.forEach(function(card) {
    card.classList.remove('open','show','match','incorrect')
  });

  //create an empty array to hold the inner HTML of all the cards
  const allCardsInnerHTML = [];

  //add the inner HTML of all cards to the allCardsInnerHTML array
  allCards.forEach(function(card) { 
    allCardsInnerHTML.push(card.innerHTML);
  });

  //shuffeles the cards and stores them in a new array
  const shuffeledCards = shuffle(allCardsInnerHTML);

  //adds each shuffeled card's HTML to the page 
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].innerHTML = shuffeledCards[i]; 
  }
}

shuffleCards();

/******************************************************************/

//used to see if card is aldready in the matchedCards array
function containsObject(obj, array) {
  for (let i = 0; i < array.length; i++) {
      if (array[i] === obj) {
          return true;
      }
  }
  return false;
}

//display a card
function displayCard(evt) {
  evt.target.classList.add('open','show');
}

//display a card thats matched
function displayMatched(evt) {
  evt.target.classList.remove('open','show');
  evt.target.classList.add('match');
}

//display a card thats mismatched
function displayMismatched(evt) {
  evt.target.classList.add('incorrect');
  setTimeout(function() {resetClasses(evt);}, 1000);
}

//clear a cards classes
function resetClasses(evt) {
  evt.target.classList.remove('open','show','incorrect');
}

let matchedCards = [];

let openCard1;
let openCard2;

let moves = 0;
let seconds = 0;

let gameTime;

//update move counter on page
function updateMoveCounter () {
  const movesSpan = document.querySelector('.moves');

  movesSpan.textContent = moves;
}

//adjust number of stars on page
function adjustStars() {
  const star = document.querySelector('.star');
    
  if (moves == 16) {
    star.remove();
  }

  if (moves == 25) {
    star.remove();
  }
}

//starting and updating the game time
function startGameTime() {
  seconds++;
  document.querySelector('.timer').innerHTML = `${seconds} Seconds`;
} 

//reset everything
function resetGame() {
  clearInterval(gameTime);
  seconds = 0;
  gameTime = '';
  document.querySelector('.timer').innerHTML = `${seconds} Seconds`;
  
  moves = 0;
  updateMoveCounter();

  const starsContainer = document.querySelector('.stars');
  const star = document.querySelector('.star');

  if (starsContainer.childElementCount == 1) {
      starsContainer.insertAdjacentHTML('beforeend', star.outerHTML);
      starsContainer.insertAdjacentHTML('beforeend', star.outerHTML);
    }
  if (starsContainer.childElementCount == 2) {
      starsContainer.insertAdjacentHTML('beforeend', star.outerHTML);
  }

  matchedCards = [];
  openCard1 = '';
  openCard2 = '';
  
  shuffleCards();
}

/******************************************************************/

//sets up the event listener for a card when it is clicked
document.querySelector('.deck').addEventListener('click', function(evt) {
  //checks to see that it is a card that your're clicking, not an icon
  if (evt.target.className === 'card') {
    
    //if the card is alread in matchedCards, do nothing
    if (! containsObject(evt.target,matchedCards)) {

      //if the times isn't already started, start it
      if (!gameTime) { 
          gameTime = setInterval(startGameTime, 1000);
        }
      
      //if openCard1 is empty, add to openCard1
      if (!openCard1) {
          displayCard(evt);
          openCard1 = evt;
       }

        //if openCard2 is empty, add to openCard2
        else {
          displayCard(evt);
          openCard2 = evt;
          
          //if card 2 has the same symbol as card 1, tag the cards with matched class and push them to the matched array, empty card1+2 variables and add 1 move
          if (openCard2.target.firstElementChild.className == openCard1.target.firstElementChild.className) {
              displayMatched(openCard1);
              displayMatched(openCard2);
              matchedCards.push(openCard1.target);
              matchedCards.push(openCard2.target);
              openCard1 = '';
              openCard2 = '';

              moves += 1;
              updateMoveCounter();
              adjustStars();

          
          //winning: if all the cards are matched, meaning they're all in the matched cards array, stop the timer and display the modal  
          if (matchedCards.length == 16) {
              const finishingTime = seconds;
              clearInterval(gameTime);
              document.querySelector('#victoryNote').
                textContent = `With ${moves} moves in ${finishingTime} seconds. Youre rating is ${document.querySelector('.stars').childElementCount} stars.`;
              document.querySelector('#modal').style.display = 'block';
              document.querySelector('.w3-btn').addEventListener('click', function() {resetGame();});
            }    
          
        }
            //if the cards don't have the same symbol, display red mismatch, clear class tags, empty card1+2 variables and add 1 move
            else {
              displayMismatched(openCard1);
              displayMismatched(openCard2);

              openCard1 = '';
              openCard2 = '';

              moves += 1;
              updateMoveCounter();
              adjustStars();
          }
      }
    } 
  }
});

//sets up the event listener for the reset button
document.querySelector('.reset').addEventListener('click', function() {resetGame();});
})();