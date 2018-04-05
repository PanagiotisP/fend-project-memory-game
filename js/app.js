let openedCards = [];
let movesCounter = 0;
let wrongMovesCounter = 0;
let start = false;
let second = 0, minute = 0; hour = 0;
let interval;
let timer = document.querySelector('.timer');
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', gameReset);
const classNames = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const cardElementHtml = '<i></i>';
let cardList = [];

// Create the 16 cards

for (let i = 0; i < 16; i++) {
    let cardElement = document.createElement('li');
    cardElement.innerHTML = cardElementHtml;
    cardElement.classList.toggle('card');
    cardElement.children[0].classList.toggle('fa');
    cardElement.children[0].classList.toggle(classNames[i % 8]);
    cardElement.addEventListener('click', respondToTheClick);
    cardList.push(cardElement);
}

// Shuffle function

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

gameReset();

// Game creation/reset functions

function createGame() {
    shuffle(cardList);
    printMoves();
    let deck = document.getElementsByClassName('deck')[0];
    const myDocFrag = document.createDocumentFragment();
    for (let i = 0; i < cardList.length; i++) {
        myDocFrag.appendChild(cardList[i]);
    }
    deck.appendChild(myDocFrag);
}

function gameReset() {
    start = false;
    openedCards = [];
    movesCounter = 0;
    wrongMovesCounter = 0;
    document.querySelector('.congrat-box').setAttribute('style', 'display: none');
    timeReset();
    deckReset();
    createGame();
    starsReset();
}

function starsReset() {
    let starsDeck = document.querySelector('.stars');
    let starElementHtml = '<i></i>';
    while(starsDeck.childElementCount < 3) {
        let starElement = document.createElement('li');
        starElement.innerHTML = starElementHtml;
        starElement.classList.toggle('fa');
        starElement.classList.toggle('fa-star');
        starsDeck.appendChild(starElement);
    }
    if(document.querySelector('.rating').childElementCount === 2) {
        document.querySelector('.rating').children[1].remove();
    }
}

function timeReset() {
    timer.textContent = '0 mins 0 secs';
    clearInterval(interval);
    second = 0, minute = 0; hour = 0;
}

function deckReset() {
    for (let i = 0; i < cardList.length; i++) {
        cardList[i].classList.remove('open');
        cardList[i].classList.remove('match');
        cardList[i].classList.remove('show');
        cardList[i].classList.remove('busy');
        cardList[i].classList.remove('unmatch');
    }
}

// Game's main function

function respondToTheClick(e) {
    if(!start) {
        startTimer();
        start = true;
    }
    let target = e.target;
    openedCards.push(target);
    cardToggle(target);
    checkMove(target);
    checkWin();
    printMoves();
}

// Card show function. Activated whenever a click is done

function cardToggle(target) {
    target.classList.toggle('open');
    target.classList.toggle('show');
}

// This functions checks whether there is one or two cards opened

function checkMove(target) {
    if (openedCards.length % 2 === 0) {
        checkValidity();
    }
    else {
        cardReveal(target);
    }
}

// Card animation function in case there is no other card opened

function cardReveal(target) {
    target.animate({
        transform: ['rotateY(180deg)', 'rotateY(0)'],
        easing: 'ease'
    },  {
            duration: 500
        });
        target.classList.toggle('busy');
}

// Game's logic function. Checks if the two opened cards match or not based on their class

function checkValidity() {
    let listLength = openedCards.length;
    let cardType1 = openedCards[listLength - 2].children[0].classList[1];
    let cardType2 = openedCards[listLength - 1].children[0].classList[1];
    movesCounter++;
    deckBusy(1);
    if (cardType1 === cardType2) {
        same();
    }
    else {
        different();
        checkStars();
    }
}

// Cards-match animation function

function same() {
    let listLength = openedCards.length;
    for (let i = 0; i < 2; i++) {
        targetCard = openedCards[listLength - 1 - i];
        cardToggle(targetCard);
        targetCard.classList.toggle('match');
        targetCard.animate({
            transform: ['scale(1, 1)', 'scale(1.05, 0.5)', 'scale(0.5, 1.05)', 'scale(1.05, 0.85)', 'scale(0.85, 1.05)', 'scale(1, 1)'],
            easing: 'ease'
        },
            {
                duration: 500
            });
    }
    setTimeout(function () {
        deckBusy(0);
    }, 500);
}

// This function is called if the two cards do not match. It makes the animation, increases wrong moves counter, removes the two cards from opened cards list 

function different() {
    let listLength = openedCards.length;
    wrongMovesCounter++;
    for (let i = 0; i < 2; i++) {
        let targetCard = openedCards[listLength - 1 - i];
        cardToggle(targetCard);
        targetCard.classList.toggle('unmatch');
        targetCard.animate({
            transform: ['translate(0)', 'translate(10%)', 'translate(0)', 'translate(-10%)', 'translate(0)'],
            easing: 'ease-out'
        },
            {
                duration: 500
            });
        setTimeout(function () {
            let targetCard = openedCards.pop();
            targetCard.classList.toggle('unmatch');
        }, 500);
    }
    setTimeout(function () {
        deckBusy(0);
    }, 500);
}

// This function enables or disables click events. Used to prevent clicks during animations

function deckBusy(state) {
    if (state === 0) {
        for (let i = 0; i < cardList.length; i++) {
            cardList[i].classList.remove('busy');
        }
    }
    else {
        for (let i = 0; i < cardList.length; i++) {
            cardList[i].classList.add('busy');
        }
    }
}

// The win condition is to have 16 opened cards

function checkWin() {
    if(openedCards.length == 16) {
        congratulations();
    }
}

// Function for the congratulations box

function congratulations() {
    let congratBox = document.querySelector('.congrat-box');
    document.querySelector('.moves-number').textContent = movesCounter.toString();
    clearInterval(interval);
    document.querySelector('.time').textContent = timer.textContent;
    document.querySelector('.rating').appendChild(document.querySelector('.stars').cloneNode(true));
    congratBox.setAttribute('style', 'display: inline');
    congratBox.animate({
        opacity: [0, 1]
    },
    {
        duration: 500
    });

}

// Moves counter function

function printMoves() {
    document.querySelector('.moves').textContent = movesCounter.toString() + ' Moves';
}

// Function to decrease stars in case of wrong guess

function checkStars() {
    let starsDeck = document.querySelector('.stars');
    switch(wrongMovesCounter) {
        case 8 :
            starsDeck.children[0].remove();
            break;
        case 11:
            starsDeck.children[0].remove();
            break;

    }
}

// Timer function

function startTimer() {
    interval = setInterval(function() {
        timer.textContent = minute+' mins '+second+' secs';
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    }, 1000);
}