"use strict";
//Some variables declared globally which are used over different functions
let list = [];
let timer_started = false;
let restartButton = document.getElementById("restart");
let replay = document.getElementById("replay");
let deck = document.getElementById("deck");
let matches = 0;

// jQuery type functions in javascript, regex logics from : https://toddmotto.com/javascript-hasclass-addclass-removeclass-toggleclass/

/** returns true if given class is present in the class list present else no. */
function hasClass(elem, className) {
	return new RegExp("(^|\\s)" + className + "(\\s|$)").test(elem.className);
}

/** adds class to the clas list of given element. */
function addClass(elem, className) {
	if (!hasClass(elem, className)) {
		elem.className += (elem.className ? " " : "") + className;
	}
}

/** class list of the element is replaced by removing passed class. */
function removeClass(elem, className) {
	if (hasClass(elem, className)) {
		elem.className = elem.className.replace(
			new RegExp("(^|\\s)*" + className + "(\\s|$)*", "g"),
			""
		);
	}
}

/** Just combination of addclass and remove class based upon hasClass */
function toggleClass(elem, className) {
	(hasClass(elem, className) ? removeClass : addClass)(elem, className);
}

// Shuffle function from http://stackoverflow.com/a/2450976
/**
	This function shuffle the array passed
	@param {array} array: Here array of card elements.
*/
function shuffle(array) {
	let currentIndex = array.length,
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
	let cards = deck.children,
		list_of_cards = [],
		i,
		shuffled_cards = shuffle(list_of_cards);
	/* A list to hold all the cards in the form its HTML string*/
	for (i = 0; i < cards.length; i += 1) {
		list_of_cards.push(cards[i].outerHTML);
	}

	//Now shuffling the array of strings
	deck.innerHTML = " ";
	//Adding back the cards into deck;
	for (let card of shuffled_cards) {
		deck.innerHTML += card;
	}
}

/**
	The move counter increases by one for a pair of matched or unmatched cards
 	and based upon the moves the stars are reduced
*/
function updateMoves() {
	let score = document.querySelector(".moves"),
		moves = Number(score.innerHTML),
		stars = document.querySelector("ul.stars").children;
	score.innerHTML = moves + 1;
	if (moves === 15) {
		removeClass(stars[2].children[0], "fa-star");
		addClass(stars[2].children[0], "fa-star-o");
	}

	if (moves === 20) {
		removeClass(stars[1].children[0], "fa-star");
		addClass(stars[1].children[0], "fa-star-o");
	}

}

/**function to handle flip animation */
function open(card) {
	addClass(card, "show");
}

/** function to handle animation when cards are matched */
function match() {
	list[0].className = "card match";
	list[1].className = "card match";
}

function unFlip(l) {
	setTimeout(() => {
		l[0].className = "card";
		l[1].className = "card";
	}, 1000);
}

/** Function to check if game is over or not and display success popup */
function check_game_over() {
	if (matches === 8) {
		let popup_content = document.querySelector(".popup-content"),
			time_taken = document.getElementById("timer"),
			stars = document.getElementById("stars");
		toggleClass(popup_content, "success");
		document.getElementById("time-taken").innerHTML = time_taken.innerHTML;
		stars.innerHTML = document.getElementsByClassName("stars")[0].innerHTML;
		document.getElementsByClassName("container")[0].style = "opacity:0.3";
		clearTimeout(Timer);
	}
}

/** check if the two cards that are opened are same or not */
function hasMatched() {
	if (list[0].innerHTML === list[1].innerHTML) {
		matches += 1;
		check_game_over();
		return true;
	}
	return false;
}

/** List is cleared for next selections */
function clearList() {
	list = [];
}

/** Here a list is used to store the cards which are opened */
function addToList(element) {
	list.push(element);
	// And if two cards are opened they are checked whether if matched or not
	if (list.length === 2) {
		if (hasMatched()) {
			match();
		} else {
			//If not matched they both animated and unflipped
			addClass(list[0], "wrong");
			addClass(list[1], "wrong");
			unFlip(list);
		}
		clearList();
		//The move counter byincrease by one for a pair of matched or unmatched cards
		updateMoves();
	}
}
let Timer;
/** Function to handle the time coundown */
function startTime() {
	timer_started = true;
	let timer = document.getElementById("timer"),
		minutes = document.getElementById("min"),
		seconds = document.getElementById("sec");
	Timer = setInterval(() => {
		//for every second update the time
		let min = Number(minutes.innerHTML);
		let sec = Number(seconds.innerHTML);
		sec++;
		if (sec == 60) {
			sec = 0;
			min++;
			minutes.innerHTML = min;
		}
		seconds.innerHTML = sec;
	}, 1000);
}

deck.addEventListener("click", event => {
	let card = event.target;
	// If the card flipped is first one start the timer
	if (!timer_started) startTime();
	//if click is only on card and which is unopened then flip and add it to list of opened cards
	if (card.nodeName == "LI" && card.className == "card") {
		open(card);
		addToList(card);
	}
});

/** Immediately shuffled when the content of the game is loaded*/
document.addEventListener("DOMContentLoaded", function () {
	shuffleDeck();
});

/* TODO: Restarting the game without whole reload */
function restart() {
	if (window.confirm("Do you want to restart the game??")) {
		location.reload();
	}
}

// TODO: Storing the game stats in local storage without refreshing
replay.addEventListener("click", () => {
	location.reload();
});
restartButton.addEventListener("click", restart);
