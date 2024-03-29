// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";

	var attempts = document.querySelector('#attempts');
	var failed = 0;
	var gameOver = false;
	var keyboard = document.querySelector('#keyboard');
	var maxFailed = 5;
	var wordDisplay = document.querySelector('#display');
	var words = [
		'Hangman',
		'Magiczocker',
		'Minecraft',
		'test'
	];

	function tryKey(k) {
		if (!k || gameOver) { return; }
		var ele = document.querySelector('span[data-key="' + k + '"');
		if (ele.dataset.hidden) {return;}
		ele.classList.add("pressed");
		var b = document.querySelectorAll('span[data-letter="' + k.toLowerCase() + '"]');
		if (b.length) {
			b.forEach(function(e) {
				e.innerText = e.dataset.displayletter;
				delete e.dataset.hidden;
			});
			if (!document.querySelectorAll('span[data-letter][data-hidden]').length) {
				document.querySelectorAll('span[data-letter]').forEach(function(e) {
					e.classList.add("success");
				});
				gameOver = true;
			}
		} else {
			failed++;
			attempts.innerText = failed + " / " + maxFailed;
			if (failed < maxFailed) { return; }
			document.querySelectorAll('span[data-hidden]').forEach(function(e) {
				e.innerText = e.dataset.displayletter;
				delete e.dataset.hidden;
				e.classList.add("failed");
			});
			gameOver = true;
		}
	}

	function tryKeyClick(e) {
		tryKey(e.target.dataset.key);
	}

	function reset() {
		// Word display
		wordDisplay.replaceChildren();
		keyboard.replaceChildren();
		failed = 0;
		
		var selectedWord = words[Math.floor(Math.random() * words.length)];
		for (var j = 0; j < selectedWord.length; j++) {
			var ele = document.createElement("span");
			ele.innerText = "_";
			ele.dataset.displayletter = selectedWord.substring(j, j + 1);
			ele.dataset.letter = ele.dataset.displayletter.toLowerCase();
			ele.dataset.hidden = ".";
			wordDisplay.appendChild(ele);
		}

		// Keyboard
		for (var i = 0; i < 26; i++) {
			var key = document.createElement("span");
			key.innerText = String.fromCharCode(97 + i).toUpperCase();
			key.dataset.key=key.innerText;
			key.addEventListener("click", tryKeyClick);
			keyboard.appendChild(key);
		}
		document.addEventListener("keydown", function(e) {
			if (e.isComposing || e.key === 229) { return; }
			var ele = document.querySelector('span[data-key="' + e.key.toUpperCase() + '"]');
			if (ele) { tryKey(ele.dataset.key); }
		});

		// Attempts
		attempts.innerText = "0 / " + maxFailed;
	}
	document.querySelector('#resetbtn').onclick = reset;
	reset();
});