// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";
    var click;
	var wn = document.querySelector('#winnotifier');
	var t = document.querySelector('#board');
	function checkWin() {
		if (t.rows[0].cells[0].dataset.content !== ' ') {return false;}
		var a = '';
		t.querySelectorAll('td').forEach(function(e) {
			a += e.dataset.content;
		});
		return a === ' abcdefghijklmno';
	}
	function getRandomizedField() {
		var s = (' abcdefghijklmno').split('');
		for (var i = 0; i < 30; i++) {
			var pos1 = Math.floor(Math.random() * 16);
			var pos2 = Math.floor(Math.random() * 16);
			var t = s[pos1];
			s[pos1] = s[pos2];
			s[pos2] = t;
		}
		var s_ = s.join('');
		return [
			s_.substring(0, 4).split(''),
			s_.substring(4, 8).split(''),
			s_.substring(8, 12).split(''),
			s_.substring(12, 16).split('')
		]
	}
	function replaceEntries(o, n) { // Original, New
		for (var i = 0; i < o.length; i++) {
			var t = n[i].cloneNode(true);
			t.onclick = click;
			o[i].parentElement.replaceChild(t, o[i]);
		}
	}
	function moveEntry(a, from, to) { // Array, from, to
		var b = a.slice(0, from).concat(a.slice(from + 1));
		replaceEntries(a, b.slice(0, to).concat(a[from]).concat(b.slice(to)));
	}
    click = function(e) {
		if (wn.innerText.length) {return;}
		var emptyCell = document.querySelector('td[data-content=" "]');
		if (emptyCell.cellIndex === e.target.cellIndex) {
			moveEntry(Array.from(document.querySelectorAll('td:nth-child(' + (emptyCell.cellIndex + 1) + ')')), emptyCell.parentElement.rowIndex, e.target.parentElement.rowIndex);
		} else if (emptyCell.parentElement.rowIndex === e.target.parentElement.rowIndex) {
			moveEntry(Array.from(emptyCell.parentElement.children), emptyCell.cellIndex, e.target.cellIndex);
		}
		if (checkWin()) {
			winnotifier.innerText = 'You won!';
		}
	};
	function reset() {
		t.innerText='';
		winnotifier.innerText = '';
		getRandomizedField().forEach(function(a) {
			var r = t.insertRow();
			a.forEach(function(b) {
				var c = r.insertCell();
				c.onclick = click;
				c.dataset.content = b;
				c.innerText = b;
			});
		});
	}
	reset();
	document.querySelector('#resetbtn').onclick = reset;
});