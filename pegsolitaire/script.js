// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 6, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";

	var boards = [
		"70011100011111011111111112111111111101111100011100",
		"9000111000000111000000111000111111111111121111111111111000111000000111000000111000",
		"80011100000111000001110001111111111121111111111110011100000111000",
		"70011100001110011111111112111111111100111000011100",
		"9000010000000111000001111100011111110111121111011111110001111100000111000000010000"
	];
	var clicked;
	var t = document.querySelector("#board");
	var resetbtn = document.querySelector('#resetbtn');
	var boardSelector = document.querySelector("#boardselector");
	var wn = document.querySelector('#winnotifier');
	function checkWin() {
		if (document.querySelectorAll('td[data-type="1"]').length > 1) {return;}
		wn.innerText = "You won!";
	}
	function mark(e, n) {
		e.dataset.type = n;
		e.innerText = "o";
	}
	function click(e) {
		if (e.target.dataset.type === "1") {
			clicked = e.target;
			return;
		}
		if (!clicked || e.target.dataset.type === "0") {return;}
		var a_ = t.rows[(clicked.parentElement.rowIndex + e.target.parentElement.rowIndex) * 0.5];
		if (!a_) {return;}
		var a = a_.cells[(clicked.cellIndex + e.target.cellIndex) * 0.5];
		if (!a || a.dataset.type !== "1") {return;}
		if ((clicked.parentElement.rowIndex === e.target.parentElement.rowIndex && Math.abs(clicked.cellIndex - e.target.cellIndex) === 2) || (Math.abs(clicked.parentElement.rowIndex - e.target.parentElement.rowIndex) === 2 && clicked.cellIndex === e.target.cellIndex)) {
			mark(a, "2");
			mark(e.target, "1");
			mark(clicked, "2");
			clicked = e.target;
			checkWin();
		}
	}
	function generateTable(n) {
		t.replaceChildren();
		var size = boards[n].substring(0, 1);
		var content = boards[n].substring(1);
		for (var i = 0; i < size; i++) {
			var r = t.insertRow();
			for (var j = 0; j < size; j++) {
				var c = r.insertCell(),
					p = i * size + j;
				c.dataset.type = content.substring(p, p + 1);
				c.innerText = c.dataset.type === "0" && " " || "o";
				c.onclick = click;
			}
		}
	}
	function reset() {
		wn.innerText = "";
		generateTable(boardSelector.selectedOptions[0].dataset.value);
	}
	reset();
	resetbtn.onclick = reset;
});