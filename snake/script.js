// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	'use strict';
	var fieldW = 60;
	var fieldH = 30;
	var addToDir = [
		[0, -1],
		[1, 0],
		[0, 1],
		[-1, 0]
	];
	var nextDir = 0;
	var snake = []; // x, y, dir (0=up, 1=right, 2=down, 3=left)
	var t = document.getElementById('board');
	var lost = false;
	var timeout;
	var intervalSnake = 500;
	function placeApple() {
		if (lost) {return;}
		for (var i = 0; i < 10; i++) {
			var coordx = Math.floor(Math.random() * fieldW);
			var coordy = Math.floor(Math.random() * fieldH);
			if (t.rows[coordy].cells[coordx].getAttribute('data-dir') === null) {
				t.rows[coordy].cells[coordx].setAttribute('data-apple', '.');
				return;
			}
		}
	}
	function step() {
		if (lost) {return;}
		snake.unshift([
			snake[0][0] + addToDir[nextDir][0],
			snake[0][1] + addToDir[nextDir][1],
			nextDir
		]);
		if (snake[0][0] < 0 || snake[0][0] >= fieldW || snake[0][1] < 0 || snake[0][1] >= fieldH || t.rows[snake[0][1]].cells[snake[0][0]].getAttribute('data-dirold')) {
			alert('You lost!');
			lost = true;
			return;
		}
		if (t.rows[snake[0][1]].cells[snake[0][0]].getAttribute('data-apple')) {
			t.rows[snake[0][1]].cells[snake[0][0]].removeAttribute('data-apple');
			placeApple();
		} else {
			var last = snake[snake.length - 1];
			t.rows[last[1]].cells[last[0]].removeAttribute('data-dir');
			t.rows[last[1]].cells[last[0]].removeAttribute('data-dirold');
			snake.pop();
			last = snake[snake.length - 1];
			t.rows[last[1]].cells[last[0]].removeAttribute('data-dirold');
		}
		if (snake[1]) {
			var s = snake[1];
			t.rows[s[1]].cells[s[0]].setAttribute('data-dir', snake[0][2]);
		}
		var first = snake[0];
		t.rows[first[1]].cells[first[0]].setAttribute('data-dir', first[2]);
		if (snake[1]) {
			t.rows[first[1]].cells[first[0]].setAttribute('data-dirold', first[2]);
		}
		nextDir = first[2];
		timeout = setTimeout(step, intervalSnake);
	}
	function isAllowedDir(d) {
		var curDir = Number(t.rows[snake[0][1]].cells[snake[0][0]].getAttribute('data-dir'));
		if (d === curDir || d + 2 === curDir || d - 2 === curDir) {return false;}
		return true;
	}
	function reset() {
		if (timeout) {
			clearTimeout(timeout);
		}
		lost = false;
		nextDir = 0;
		t.textContent = '';
		for (var i = 0; i < fieldH; i++) {
			var r = t.insertRow();
			for (var j = 0; j < fieldW; j++) {
				r.insertCell();
			}
		}
		snake = [
			[Math.floor(fieldW * 0.5), Math.floor(fieldH * 0.5), nextDir] // x, y, dir (0=up, 1=right, 2=down, 3=left)
		];
		t.rows[snake[0][1]].cells[snake[0][0]].setAttribute('data-dir', nextDir);
		timeout = setTimeout(step, intervalSnake);
		placeApple();
	}
	document.getElementById('resetbtn').addEventListener('click', reset);
	document.addEventListener('keydown', function(e) {
		if (e.isComposing || e.key === 229 || lost) {
		return;
		}
		if ((e.key === 'ArrowUp' || e.keyCode === 38) && isAllowedDir(0)) {
			nextDir = 0;
			clearTimeout(timeout);
			step();
		} else if ((e.key === 'ArrowRight' || e.keyCode === 39) && isAllowedDir(1)) {
			nextDir = 1;
			clearTimeout(timeout);
			step();
		} else if ((e.key === 'ArrowDown' || e.keyCode === 40) && isAllowedDir(2)) {
			nextDir = 2;
			clearTimeout(timeout);
			step();
		} else if ((e.key === 'ArrowLeft' || e.keyCode === 37) && isAllowedDir(3)) {
			nextDir = 3;
			clearTimeout(timeout);
			step();
		}
	});
	reset();
});
