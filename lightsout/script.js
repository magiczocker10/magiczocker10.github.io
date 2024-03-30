// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 6, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	"use strict";
	var counter = document.querySelector("#counter");
	var resetBtn = document.querySelector("#resetbtn");
	var wrapfield = document.querySelector("#wrapfield");
	var clicks = 0;
	var wfactive = false;
	var t = document.querySelector('#board');
	var fieldW = 5;
	var fieldH = 5;

	function wrapCoords(x, y) {
        if (!wfactive) {return [x, y];}
        if (x < 0) {x = x + fieldW;}
        if (x >= fieldW) {x = x - fieldW;}
        if (y < 0) {y += fieldH;}
        if (y >= fieldH) {y = y - fieldH;}
        return [x, y];
    }

	function toggle(_x, _y) {
		var [x, y] = wrapCoords(_x, _y);
		if (!t.rows[y] || !t.rows[y].cells[x]) {return;}
		var c = t.rows[y].cells[x];
		if (c.dataset.active) {
			delete c.dataset.active;
		} else {
			c.dataset.active = ".";
		}
	}

	function click(e) {
		clicks++;
		counter.innerText = 'Steps: ' + clicks;
		var myCoords = [e.target.cellIndex, e.target.parentElement.rowIndex];
		toggle(myCoords[0], myCoords[1]);
		toggle(myCoords[0] - 1, myCoords[1]);
		toggle(myCoords[0], myCoords[1] - 1);
		toggle(myCoords[0] + 1, myCoords[1]);
		toggle(myCoords[0], myCoords[1] + 1);
		if (document.querySelectorAll('td[data-active]').length === 0) {
			alert("You won!");
		}
	}

	function reset() {
		t.innerText='';
		clicks = 0;
		wfactive = wrapfield.checked;
		counter.innerText = 'Steps: 0';
		for (var i = 0; i < 5; i++) {
			var r = t.insertRow();
			for (var j = 0; j < 5; j++) {
				var c = r.insertCell();
				c.onclick = click;
				c.dataset.active = ".";
			}
		}
	}
	resetBtn.onclick = reset;
	reset();
});