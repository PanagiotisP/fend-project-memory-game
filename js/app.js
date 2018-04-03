let openedCards = [];
let movesCounter = 0;
let timer = 0;
let start = false;
let second = 0, minute = 0; hour = 0;
let interval;
timer = document.querySelector(".timer");
let restartButton = document.querySelector(".restart");
restartButton.addEventListener('click', gameReset);

/*
 * Create a list that holds all of your cards
 */
const classNames = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let cardElementHtml = "<i></i>";
let cardList = [];
for (let i = 0; i < 16; i++) {
    let cardElement = document.createElement("li");
    cardElement.innerHTML = cardElementHtml;
    cardElement.classList.toggle("card");
    cardElement.children[0].classList.toggle("fa");
    cardElement.children[0].classList.toggle(classNames[i % 8]);
    cardElement.addEventListener('click', respondToTheClick);
    cardList.push(cardElement);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create HTML for each card

function createGame() {
    movesCounter = 0;
    timer.textContent = "0 mins 0 secs";
    shuffle(cardList);
    printMoves();
    let deck = document.getElementsByClassName("deck")[0];
    const myDocFrag = document.createDocumentFragment();
    for (let i = 0; i < cardList.length; i++) {
        myDocFrag.appendChild(cardList[i]);
    }
    deck.appendChild(myDocFrag);
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

createGame();

function timeReset() {
    clearInterval(interval);
    second = 0, minute = 0; hour = 0;
}

function deckReset() {
    for (let i = 0; i < cardList.length; i++) {
        cardList[i].classList.remove("open");
        cardList[i].classList.remove("match");
        cardList[i].classList.remove("show");
        cardList[i].classList.remove("busy");
        cardList[i].classList.remove("unmatch");
    }
}

function gameReset() {
    start = false;
    openedCards = [];
    timeReset();
    deckReset();
    createGame();
}

function deckBusy(state) {
    if (state === 0) {
        for (let i = 0; i < cardList.length; i++) {
            cardList[i].classList.remove("busy");
        }
    }
    else {
        for (let i = 0; i < cardList.length; i++) {
            cardList[i].classList.add("busy");
        }
    }
}

function cardReveal(target) {
    target.animate({
        transform: ['rotateY(180deg)', 'rotateY(0)'],
        easing: 'ease'
    },
        {
            duration: 500
        })
        target.classList.toggle("busy");
}

function printMoves() {
    document.querySelector(".moves").textContent = movesCounter.toString() + " Moves";
}

function checkValidity() {
    let listLength = openedCards.length;
    movesCounter++;
    printMoves();
    deckBusy(1);
    let cardType = openedCards[listLength - 2].children[0].classList[1];
    if (openedCards[listLength - 1].children[0].classList.contains(cardType)) {
        same();
    }
    else {
        different();
    }
}

function cardToggle(target) {
    target.classList.toggle("open");
    target.classList.toggle("show");
}

function same() {
    let listLength = openedCards.length;
    for (let i = 0; i < 2; i++) {
        targetCard = openedCards[listLength - 1 - i];
        cardToggle(targetCard);
        targetCard.classList.toggle("match");
        targetCard.animate({
            transform: ['scale(1, 1)', 'scale(1.05, 0.5)', 'scale(0.5, 1.05)', 'scale(1.05, 0.85)', 'scale(0.85, 1.05)', 'scale(1, 1)'],
            easing: 'ease'
        },
            {
                duration: 500
            })
    }
    setTimeout(function () {
        deckBusy(0);
    }, 500);
}

function different() {
    let listLength = openedCards.length;
    for (let i = 0; i < 2; i++) {
        let targetCard = openedCards[listLength - 1 - i];
        cardToggle(targetCard);
        targetCard.classList.toggle("unmatch");
        targetCard.animate({
            transform: ['translate(0)', 'translate(10%)', 'translate(0)', 'translate(-10%)', 'translate(0)'],
            easing: 'ease-out'
        },
            {
                duration: 500
            });
        setTimeout(function () {
            let targetCard = openedCards.pop();
            targetCard.classList.toggle("unmatch");
        }, 500);
    }
    setTimeout(function () {
        deckBusy(0);
    }, 500);
}

function checkMove(target) {
    if (openedCards.length % 2 === 0) {
        checkValidity();
    }
    else {
        cardReveal(target);
    }
}

function checkWin() {
    if(openedCards.length == 16) {

    }
}

function respondToTheClick(e) {
    if(!start) {
        startTimer();
        start = true;
    }
    let target = e.target;
    cardToggle(target);
    openedCards.push(target);
    checkMove(target);
    checkWin();
}

function startTimer() {
    interval = setInterval(function(){
        timer.textContent = minute+" mins "+second+" secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}