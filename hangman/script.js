// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";

	var attempts = document.getElementById('attempts');
	var failed = 0;
	var gameOver = false;
	var keyboard = document.getElementById('keyboard');
	var maxFailed = 5;
	var wordDisplay = document.getElementById('display');
	var words = [
		'Hangman',
		'Magiczocker',
		'Minecraft',
		'test'
	];

	function tryKey(k) {
		if (!k || gameOver) { return; }
		var ele = document.querySelector('span[data-key="' + k + '"]');
		if (ele.getAttribute('data-hidden')) {return;}
		addClass(ele, "pressed");
		var b = document.querySelectorAll('span[data-letter="' + k.toLowerCase() + '"]');
		if (b.length) {
			for (var i = 0; i < b.length; i++) {
				b[i].innerText = b[i].getAttribute('data-displayletter');
				b[i].removeAttribute('data-hidden');
			}
			if (!document.querySelectorAll('span[data-letter][data-hidden]').length) {
				var c = document.querySelectorAll('span[data-letter]');
				for (var l = 0; l < c.length; l++) {
					addClass(c[l], "success");
				}
				gameOver = true;
			}
		} else {
			failed++;
			attempts.innerText = failed + " / " + maxFailed;
			if (failed < maxFailed) { return; }
			var s = document.querySelectorAll('span[data-hidden]');
			for (var j = 0; j < s.length; j++) {
				s[j].innerText = s[j].getAttribute('data-displayletter');
				s[j].removeAttribute('data-hidden');
				addClass(s[j], "failed");
			}
			gameOver = true;
		}
	}

	function tryKeyClick(e) {
		tryKey(e.target.getAttribute('data-key'));
	}

	function reset() {
		// Word display
		wordDisplay.innerText = '';
		keyboard.innerText = '';
		failed = 0;
		gameOver = false;
		
		var selectedWord = words[Math.floor(Math.random() * words.length)];
		for (var j = 0; j < selectedWord.length; j++) {
			var ele = document.createElement("span");
			ele.innerText = "_";
			ele.setAttribute('data-displayletter', selectedWord.substring(j, j + 1));
			ele.setAttribute('data-letter', ele.getAttribute('data-displayletter').toLowerCase());
			ele.setAttribute('data-hidden', '.');
			wordDisplay.appendChild(ele);
		}

		// Keyboard
		for (var i = 0; i < 26; i++) {
			var key = document.createElement("span");
			key.innerText = String.fromCharCode(97 + i).toUpperCase();
			key.setAttribute('data-key', key.innerText);
			key.addEventListener("click", tryKeyClick);
			keyboard.appendChild(key);
		}

		// Attempts
		attempts.innerText = "0 / " + maxFailed;
	}
	document.addEventListener("keydown", function(e) {
		if (e.isComposing || e.key === 229) { return; }
		var ele = document.querySelector('span[data-key="' + e.key.toUpperCase() + '"]');
		if (ele) { tryKey(ele.getAttribute('data-key')); }
	});
	document.getElementById('resetbtn').addEventListener('click', reset);
	reset();
});