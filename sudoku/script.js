/*
	Sizes 4x4, 6x6, 9x9
*/
// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";
	var t = document.querySelector("#board");
	var wn = document.querySelector('#winnotifier');
	var sizes = {4: [2, 2, 10], 6: [3, 2, 21], 9: [3, 3, 45]}, // Width, Height, Sum per col/row
		field = [],
		size = 9;
	var last;
	function getSumOfColOrRow(n, isCol) {
		var c = 0;
		t.querySelectorAll(isCol ? 'td:nth-child(' + n + ')' : 'tr:nth-child(' + n + ') td').forEach(function(e) {
			c += Number(e.innerText);
		});
		return c;
	}
	function checkWin() {
		for (var i = 0; i < size; i++) {
			if (getSumOfColOrRow(i + 1, false) !== sizes[size][2]) {return false;}
			if (getSumOfColOrRow(i + 1, true) !== sizes[size][2]) {return false;}
		}
		wn.innerText = "You won!";
		return true;
	}
	function generateField(size) {
		var a = ('123456789').substring(0, size);
		a = a.repeat(4);
		for (var i = 0; i < size; i++) {
			var offset = Math.ceil((i + 1) / size * sizes[size][0]) - 1;
			field[i] = a.substring(i * sizes[size][0] + offset, i * sizes[size][0] + size + offset).split("");
		}
	}
	function switchCol(a, b) {
		for (var i = 0; i < field.length; i++) {
			var tmp = field[i][a];
			field[i][a] = field[i][b];
			field[i][b] = tmp;
		}
	}
	function switchRow(a, b) {
		var tmp = field[a];
		field[a] = field[b];
		field[b] = tmp;
	}
	function randomizeField(func, var1, var2) {
		var col1, col2, i;
		// Columns / Rows
		for (i = 0; i < 10; i++) {
			col1 = Math.floor(Math.random() * var2) * var1;
			col2 = Math.floor(Math.random() * var2) * var1;
			if (col1 === col2) {continue;}
			for (var j = 0; j < var1; j++) {
				func(col1 + j, col2 + j);
			}
		}
		// Column / Row-Content
		for (i = 0; i < 10; i++) {
			var col = Math.floor(Math.random() * var2) * var1;
			col1 = Math.floor(Math.random() * var1);
			col2 = Math.floor(Math.random() * var1);
			if (col1 === col2) {continue;}
			func(col + col1, col + col2);
		}
	}
	function generateTable(size) {
		t.replaceChildren();
		for (var i = 0; i < size; i++) {
			var row = t.insertRow();
			for (var j = 0; j < size; j++) {
				var cell = row.insertCell();
				cell.textContent = field[i][j];
			}
		}
	}
	function replaceRandomEntries(n) {
		var r = t.rows;
		for (var i = 0; i < n; i++) {
			var x = Math.floor(Math.random() * size);
			var y = Math.floor(Math.random() * size);
			r[y].cells[x].innerText = "";
			r[y].cells[x].classList.add('input');
		}
	}
	function reset() {
		wn.innerText = '';
		size = Number(document.getElementById("sizeselector").selectedOptions[0].dataset.size);
		t.setAttribute('data-size', size);
		var i = document.getElementById('input');
		i.replaceChildren();
		var s = sizes[size];
		for (var j = 0; j < s[1]; j++) {
			var r = i.insertRow();
			for (var k = 0; k < s[0]; k++) {
				var td = document.createElement("td");
				td.innerText = j * s[0] + k + 1;
				r.appendChild(td);
			}
		}

		generateField(size);
		randomizeField(switchCol, sizes[size][0], sizes[size][1]);
		randomizeField(switchRow, sizes[size][1], sizes[size][0]);
		generateTable(size);
		replaceRandomEntries(Number(document.getElementById("diffselector").selectedOptions[0].dataset.emptycells.split(",")[document.getElementById("sizeselector").selectedIndex]));
	}
	document.getElementById("resetbtn").addEventListener('click', reset);
	document.getElementById('board').addEventListener('click', function(e) {
		if (e.target.nodeName !== 'TD' || !e.target.classList.contains('input')) return;

		if (last) last.classList.remove('selected');
		last = e.target;
		last.classList.add('selected');
	});
	document.getElementById('input').addEventListener('click', function(e) {
		if (!last || e.target.nodeName !== 'TD') return;

		last.textContent = e.target.textContent;
		checkWin();
	});
	document.addEventListener("keydown", function(e) {
		if (e.isComposing || e.key === 229) { return; }
		if (e.key > 0 && e.key <= size) {
			last.textContent = e.key;
			checkWin();
		}
	});
	reset();
});