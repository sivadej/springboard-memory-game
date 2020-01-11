//let shuffledCards = shuffle([ '01', '01', '02', '02', '03', '03', '04', '04' ]); //to set image src and IDs for matching pairs
const imgIds = ['01','02','03','04','05']; //instead of manually entering pairs, loop and push into new array twice, then shuffle
//image src will be formatted as images/${imgId}.jpg
let shuffledCards = [];
for (imgId of imgIds){
	shuffledCards.push(imgId);
	shuffledCards.push(imgId);
}
shuffledCards = shuffle(shuffledCards);

const counter = document.querySelector('#counter'); //total card "flips" per game
const newGameBtn = document.querySelector('#new-game-btn');
const gameBoard = document.querySelector('#gameboard');

let bestScore = localStorage.getItem('best-score');
let movesCounted = 0;
let cardsInPlay = 0;
let firstCardPicked = '';
let firstPickSlot = '';
let secondCardPicked = '';
let secondPickSlot = '';
let matchesFound = 0;

document.querySelector('#best-score').innerHTML = bestScore;

displayCards();

newGameBtn.addEventListener('click', resetGame);

gameBoard.addEventListener('click', function(e) {
	if (e.target.tagName === 'IMG') {
		e.target.classList.add('disabled');
		cardsInPlay++;
		increaseCounter();
		//console.log('cards in play: ' + cardsInPlay);
		if (cardsInPlay === 1) {
			e.target.setAttribute('src', `images/${e.target.dataset.id}.jpg`);
			firstCardPicked = e.target.dataset.id;
			firstPickSlot = e.target.id;
		}
		else if (cardsInPlay === 2) {
			e.target.setAttribute('src', `images/${e.target.dataset.id}.jpg`);
			secondCardPicked = e.target.dataset.id;
			secondPickSlot = e.target.id;
			//console.log(`Checking for match... ids picked: ${firstCardPicked} and ${secondCardPicked}`);
			//console.log(`Slots picked: ${firstPickSlot} and ${secondPickSlot}`);
			cardsInPlay = 0;
			if (firstCardPicked === secondCardPicked) {
				//console.log('woohoo, its a match!');
				matchesFound++;
				if (matchesFound === imgIds.length) {
					document.getElementById('status').innerHTML = '<b>WINNER!</b>';
					updateBestScore(movesCounted);
				}
			}
			else resetMismatch(firstPickSlot, secondPickSlot);
		}
	}
});

function displayCards() {
	gameBoard.innerHTML = '';
	for (let [ index, card ] of shuffledCards.entries()) {
		//index represents each slot on the board (slot0-slot7)
		const newCard = document.createElement('img');
		//newCard.setAttribute('src', `images/${card}.jpg`);
		newCard.setAttribute('id', 'slot' + index);
		newCard.setAttribute('data-id', card);
		newCard.setAttribute('class', 'card');
		gameBoard.append(newCard);
	}
	let allCards = gameBoard.querySelectorAll('.card');
	for (let card of allCards) {
		card.setAttribute('src', 'images/hidden.jpg');
	}
}

function resetGame() {
	//reset all counts, reshuffle card array, hide cards
	gameBoard.classList.remove('disabled');
	const gameImgs = gameBoard.querySelectorAll('img');
	for (const img of gameImgs) img.classList.remove('disabled');
	document.querySelector('#best-score').innerHTML = bestScore;
	movesCounted = 0;
	counter.innerHTML = '0';
	document.getElementById('status').innerHTML = '';
	shuffledCards = shuffle(shuffledCards);
	cardsInPlay = 0;
	firstCardPicked = '';
	firstPickSlot = '';
	secondCardPicked = '';
	secondPickSlot = '';
	matchesFound = 0;
	displayCards();
}

function updateBestScore(score){
	if (score < bestScore || !bestScore){
		bestScore = score;
		localStorage.setItem('best-score',score);
		document.querySelector('#best-score').innerHTML = 'NEW! ' + score;
	}
}

function increaseCounter() {
	movesCounted++;
	counter.innerHTML = movesCounted;
}

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function resetMismatch(firstSlot, secondSlot) {
	gameBoard.classList.toggle('disabled'); //to prevent cards from being revealed while waiting to reset the mismatch
	const reset = setTimeout(function() {
		document.getElementById(firstSlot).setAttribute('src', 'images/hidden.jpg');
		document.getElementById(firstSlot).classList.remove('disabled');
		document.getElementById(secondSlot).setAttribute('src', 'images/hidden.jpg');
		document.getElementById(secondSlot).classList.remove('disabled');
		gameBoard.classList.toggle('disabled');
		//console.log('cleared!');
	}, 1000);
}
