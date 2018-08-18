'use strict';
//Some variables declared globally which are used over different functions
var list = [];
var timer_started = false;
var restartButton = document.getElementById('restart');
var replay = document.getElementById('replay');
var deck = document.getElementById('deck');
var matches = 0;

// jQuery type functions in javascript, regex logics from : https://toddmotto.com/javascript-hasclass-addclass-removeclass-toggleclass/

function hasClass(elem, className) {
	// returns true if given class is present in the class list present else no
	return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
}

function addClass(elem, className) {
	// adds class to the clas list of given element
	if (!hasClass(elem, className)) {
		elem.className += (elem.className ? ' ' : '') + className;
	}
}

function removeClass(elem, className) {
	// class list of the element is replaced by removing passed class.
	if (hasClass(elem, className)) {
		elem.className = elem.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
	}
}

function toggleClass(elem, className) {
	// just combination of addclass and remove class based upon hasClass
	(hasClass(elem, className) ? removeClass : addClass)(elem, className);
}

// Shuffle function from http://stackoverflow.com/a/2450976

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

function shuffleDeck() {
	var cards = deck.children,
		list_of_cards = [],
		i,
		shuffled_cards = shuffle(list_of_cards);
	/* A list to hold all the cards in the form its HTML string*/
	for (i = 0; i < cards.length; i += 1) {
		list_of_cards.push(cards[i].outerHTML);
	}

	//Now shuffling the array of strings
	deck.innerHTML = ' ';
	//Adding back the cards into deck;
	for (var card of shuffled_cards) {
		deck.innerHTML += card;
	}
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


function updateMoves() {
	// Function updates the moves after each flip
	// and based upon the moves the stars are reduced
	var score = document.querySelector('.moves'),
		moves = Number(score.innerHTML),
		stars = document.querySelector('ul.stars').children;
	score.innerHTML = moves + 1;
	if (moves === 30) {
		removeClass(stars[2].children[0], 'fa-star');
		addClass(stars[2].children[0], 'fa-star-o');
	}

	if (moves === 38) {
		removeClass(stars[1].children[0], 'fa-star');
		addClass(stars[1].children[0], 'fa-star-o');
	}

	if (moves === 48) {
		removeClass(stars[0].children[0], 'fa-star');
		addClass(stars[0].children[0], 'fa-star-o');
	}
}

function open(card) {
	//function to handle flip animation
	addClass(card, 'show');
	//addClass(card, 'open');
}

function match() {
	//function to handle animation when cards are matched
	list[0].className = 'card match';
	list[1].className = 'card match';
}

function unFlip(l) {

	setTimeout(() => {
		l[0].className = 'card';
		l[1].className = 'card';
	}, 1000);
}

function check_game_over() {
	//Function to check if game is over or not and display success popup
	if (matches === 8) {
		var popup_content = document.querySelector(".popup-content"),
			stars = document.getElementById('stars');
		toggleClass(popup_content, 'success');
		stars.innerHTML = document.getElementsByClassName('stars')[0].innerHTML;
		document.getElementsByClassName('container')[0].style = 'opacity:0.3';
		clearTimeout(Timer);
	}
}

function hasMatched() {
	// check if the two cards that are opened are same or not
	if (list[0].innerHTML === list[1].innerHTML) {
		matches += 1;
		check_game_over();
		return true;
	}
	return false;
}

function clearList() {
	//List is cleared for next selections
	list = [];
}

//Here a list is used to store the cards which are opened
function addToList(element) {
	list.push(element);
	// And if two cards are opened they are checked whether if matched or not
	if (list.length === 2) {
		if (hasMatched()) {
			match();
		} else {
			//If not matched they both animated and unflipped
			addClass(list[0], 'wrong');
			addClass(list[1], 'wrong');
			unFlip(list);
		}
		clearList();
	}
}
var Timer;
function startTime() {
	// Function to handle the time coundown
	timer_started = true;
	var timer = document.getElementById('timer'),
		minutes = document.getElementById('min'),
		seconds = document.getElementById('sec');
	Timer = setInterval(() => {
		//for every second update the time
		var min = Number(minutes.innerHTML);
		var sec = Number(seconds.innerHTML);
		sec++;
		if (sec == 60) {
			sec = 0;
			min++;
			minutes.innerHTML = min;
		}
		seconds.innerHTML = sec;
	}, 1000);
}


deck.addEventListener('click', event => {
	var card = event.target;
	// If the card flipped is first one start the timer
	if (!timer_started)
		startTime();
	//if click is only on card and which is unopened then flip and add it to list of opened cards
	if (card.nodeName == 'LI' && card.className == 'card') {
		open(card);
		addToList(card);
		// for every valid opening update the moves and show the same
		updateMoves()
	}
});

document.addEventListener('DOMContentLoaded', function () {
	// Immediately shuffled when the content of the game is loaded
	shuffleDeck();
});

/* TODO: Restarting the game without whole reload */
function restart() {
	if (window.confirm('Do you want to restart the game??')) {
		location.reload();
	}
}

// TODO: Storing the game stats in local storage without refreshing
replay.addEventListener('click', () => {
	location.reload();

});
restartButton.addEventListener('click', restart);