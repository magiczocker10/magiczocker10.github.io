// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 6, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";

	var pattern = [1, -1]; // 1 = right, -1 = left
	var colors = ['#0f0', '#f00'];
	var refreshDelay = 1;
	var antPos = [];
	var antDir = 0;
	var refreshIntervalEle = document.querySelector("#refreshinterval");
	var stepsPerInterval = document.querySelector("#stepsperinterval");
	var startDirEle = document.querySelector("#startdir");
	var t = document.querySelector('#board');
	var resetbtn = document.querySelector("#resetbtn");
	var timeout;
	var stepsPerRefresh = 1;
	var stepCounter = 0;
	var counterEle = document.querySelector('#counter');
	var widthEle = document.querySelector('#widthinput');
	var heightEle = document.querySelector('#heightinput');

	function generateTable(w, h) {
		t.innerText='';
		for (var i = 0; i < h; i++) {
			var r = t.insertRow();
			for (var j = 0; j < w; j++) {
				var c = r.insertCell();
				c.dataset.state = "0";
			}
		}
		antPos[0] = Math.floor(t.rows[0].cells.length * 0.5);
		antPos[1] = Math.floor(t.rows.length * 0.5);
	}

	function moveAnt() {
		if (!t.rows[antPos[1]] || !t.rows[antPos[1]].cells[antPos[0]]) {return;}
		var c = t.rows[antPos[1]].cells[antPos[0]];
		c.dataset.state = Number(c.dataset.state) + 1;
		if (c.dataset.state > pattern.length) {
			c.dataset.state = "1";
		}
		c.style.background = colors[Number(c.dataset.state) - 1];
		antDir = antDir + pattern[Number(c.dataset.state) - 1];
		if (antDir < 0) {
			antDir += 4;
		} else if (antDir > 3) {
			antDir -= 4;
		}
		if (antDir === 0) { // Up
			antPos[1] -= 1;
		} else if (antDir === 1) { // Right
			antPos[0] += 1;
		} else if (antDir === 2) { // Down
			antPos[1] += 1;
		} else if (antDir === 3) { // Left
			antPos[0] -= 1;
		}
	}

	function moveAnt_() {
		for (var k = 0; k < stepsPerRefresh; k++) {
			stepCounter++;
			moveAnt();
		}
		counterEle.innerText = "Step: " + stepCounter;
		if (t.rows[antPos[1]] && t.rows[antPos[1]].cells[antPos[0]]) {
			timeout = setTimeout(moveAnt_, refreshDelay);
		} else {
			alert("The field is not big enough for more steps");
		}
	}

	function reset() {
		if (timeout) {
			clearTimeout(timeout);
		}
		stepCounter = 0;
		refreshDelay = Number(refreshIntervalEle.value);
		stepsPerRefresh = Number(stepsPerInterval.value);
		antDir = Number(startDirEle.selectedOptions[0].dataset.value);
		counterEle.innerText = "Step: 0";
		generateTable(Number(widthEle.value), Number(heightEle.value));
		timeout = setTimeout(moveAnt_, refreshDelay);
	}
	refreshIntervalEle.value = 1000;
	stepsPerInterval.value = 1;
	widthEle.value = 150;
	heightEle.value = 150;

	reset();
	resetbtn.onclick = reset;
});