// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	'use strict';
	var counter = document.getElementById("counter");
	var resetBtn = document.getElementById("resetbtn");
	var wrapfield = document.getElementById("wrapfield");
	var clicks = 0;
	var wfactive = false;
	var t = document.getElementById('board');
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
		var data = wrapCoords(_x, _y);
		var x = data[0];
		var y = data[1];
		if (!t.rows[y] || !t.rows[y].cells[x]) {return;}
		var c = t.rows[y].cells[x];
		if (c.getAttribute('data-active')) {
			c.removeAttribute('data-active');
		} else {
			c.setAttribute('data-active', '.');
		}
	}

	function click(e) {
		clicks++;
		counter.textContent = 'Steps: ' + clicks;
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
		t.textContent = '';
		clicks = 0;
		wfactive = wrapfield.checked;
		counter.textContent = 'Steps: 0';
		for (var i = 0; i < 5; i++) {
			var r = t.insertRow();
			for (var j = 0; j < 5; j++) {
				var c = r.insertCell();
				c.onclick = click;
				c.setAttribute('data-active', '.');
			}
		}
	}
	resetBtn.addEventListener('click', reset);
	reset();
});