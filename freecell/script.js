// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	'use strict';
	var draggedCard;
	var dragOffset = [];
	var charIndex = 'A23456789TJQK';
	var colorLookup = {
		C: 'black',
		D: 'red',
		H: 'red',
		S: 'black'
	};
	var isNintendo;
	function checkWin() {
		var e = document.querySelectorAll('#goal > div');
		for (var i = 0; i < e.length; i++) {
			if (!e[i].lastChild || e[i].lastChild.getAttribute('data-cardnumber') !== 'K') {
				return false;
			}
		}
		return true;
	}
	function isCardStackAllowed(source, destination) {
        return (
			charIndex.indexOf(source.getAttribute('data-cardnumber')) === charIndex.indexOf(destination.getAttribute('data-cardnumber')) + 1 &&
			colorLookup[source.getAttribute('data-cardtype')] !== colorLookup[destination.getAttribute('data-cardtype')]
		);
	}
	function removeAllDraggables() {
		var e = document.querySelectorAll('div[draggable]');
		for (var a = 0; a < e.length; a++) {
			e[a].removeAttribute('draggable');
		}
	}
	function isValidTarget(source, target) {
		if (!target ||
			(target.getAttribute('data-maxpermove') && source.length > Number(target.getAttribute('data-maxpermove'))) ||
			(target.getAttribute('data-max') && source.length > (Number(target.getAttribute('data-max')) - target.children.length))) {return false;}
		if (target.parentElement.id === 'goal') {
			if (
				(target.children.length && (
					target.lastChild.getAttribute('data-cardtype') !== source[0].getAttribute('data-cardtype') ||
					charIndex.indexOf(target.lastChild.getAttribute('data-cardnumber')) + 1 !== charIndex.indexOf(source[0].getAttribute('data-cardnumber'))
				)) ||
				(
					!target.children.length &&
					source[0].getAttribute('data-cardnumber') !== 'A'
				)
			) {
				return false;
			}
		} else if (target.parentElement.id === 'field') {
			return (
				(
					!target.children.length &&
					source[0].getAttribute('data-cardnumber') === 'K'
				) ||
				(
					target.children.length &&
					charIndex.indexOf(target.lastChild.getAttribute('data-cardnumber')) === charIndex.indexOf(source[0].getAttribute('data-cardnumber')) + 1 &&
					colorLookup[target.lastChild.getAttribute('data-cardtype')] !== colorLookup[source[0].getAttribute('data-cardtype')]
				)
			);
		}
		return true;
	}
	function addDraggableToMovableCards() {
		removeAllDraggables();
        var t = document.querySelectorAll('div[data-istarget]');
		for (var i = 0; i < t.length; i++) {
			var a = t[i].children[t[i].children.length - 1];
            if (!a) {continue;}
			a.setAttribute('draggable', 'true');
			for (var j = t[i].children.length - 2; j >= 0; j--) {
				if (isCardStackAllowed(t[i].children[j], t[i].children[j + 1])) {
					t[i].children[j].setAttribute('draggable', 'true');
				} else {
					break;
				}
			}
		}
	}
	function mouseup() {
		if (!draggedCard) {return;}
		var target = document.querySelector('div[data-targeted]');
		var c = document.querySelectorAll('.card[data-drag]');
		if (!isValidTarget(c, target)) {target = undefined;}
		for (var i = 0; i < c.length; i++) {
			if (target && target !== c[i].parentElement) {
				target.appendChild(c[i]);
				c[i].setAttribute('data-index', target.children.length - 1);
			}
			c[i].style.left = '';
			c[i].style.top = '';
			c[i].removeAttribute('data-drag');
		}
		if (target) {
			addDraggableToMovableCards();
			target.removeAttribute('data-targeted');
		}
        draggedCard = null;
		if (checkWin()) {
			alert('You won!');
		}
	}
	document.addEventListener('mouseup', mouseup);
	document.addEventListener('touchend', mouseup);
	function mousemove(e) {
		if (!draggedCard) {return;}
		var cX = e.clientX || e.touches[0].clientX;
		var cY = e.clientY || e.touches[0].clientY;
        var b;
		b = document.querySelector('div[data-targeted]');
		if (b) {b.removeAttribute('data-targeted');}
		b = document.querySelectorAll('.card[data-drag]');
		for (var i = 0; i < b.length; i++) {
			b[i].style.left = (cX - dragOffset[0]) + 'px';
			b[i].style.top = (cY + 20 * i - dragOffset[1]) + 'px';
		}
		var targets = document.querySelectorAll('div[data-istarget]');
		var dO = [0, 0];
		if (isNintendo) {
			dO[0] = dragOffset[0];
			dO[1] = dragOffset[1];
		}
		for (i = 0; i < targets.length; i++) {
			if (
				cX-dO[0] >= targets[i].offsetLeft && cX-dO[0] <= targets[i].offsetLeft + targets[i].clientWidth &&
				cY-dO[1] >= targets[i].offsetTop && cY-dO[1] <= targets[i].offsetTop + targets[i].clientHeight
			) {
				if (!isValidTarget(document.querySelectorAll('.card[data-drag]'), targets[i])) {break;}
				targets[i].setAttribute('data-targeted', '.');
				break;
			}
		}
	}
	document.addEventListener('mousemove', mousemove);
	document.addEventListener('touchmove', mousemove);
	function cardToColumn(column, card) {
		var col = document.getElementById('column' + column);
		var latestCard = col.children.length - 1;
		var cardDiv = document.createElement('div');
		cardDiv.className = 'card';
		cardDiv.setAttribute('data-cardnumber', card.substring(0,1));
        cardDiv.setAttribute('data-cardtype', card.substring(1,2));
		var cardName = document.createElement('span');
		cardName.innerText = card.substring(0, 1);
		cardDiv.appendChild(cardName);
		var cardName2 = document.createElement('span');
		cardName2.innerText = card.substring(1, 2);
		cardDiv.appendChild(cardName2);
		cardDiv.setAttribute('data-index', latestCard + 1);
		col.appendChild(cardDiv);
		cardDiv.addEventListener('drag', function(e) {
			e.preventDefault();
		});
	}

    var _f = function(e) {
        e.preventDefault();
        if (!hasClass(e.target, 'card') || !e.target.getAttribute('draggable')) {return;}
		dragOffset[0] = 0;
		dragOffset[1] = 0;
		isNintendo = e.layerX < 0;
		if (e.layerX) {
			dragOffset[0] = (e.layerX < 0 ? e.layerX*-1 : e.pageX) - e.target.offsetLeft;
			dragOffset[1] = (e.layerY < 0 ? e.layerY*-1 : e.pageY) - e.target.offsetTop;
		}
        draggedCard = e.target;
        for (var j = e.target.getAttribute('data-index'); j < e.target.parentElement.children.length; j++) {
            e.target.parentElement.children[j].setAttribute('data-drag', '.');
        }
    };
	var t = document.querySelectorAll('div[data-istarget]');
    for (var i = 0; i < t.length; i++) {
        t[i].addEventListener('dragstart', _f);
        t[i].addEventListener('touchstart', _f);
    }

	/*
	clubs / Kreuz / Black
	diamond / Karo / Red
	hearts / Herz / Red
	spades / Pik / Black

	Hearts, diamonds, spades, clubs

	JD 2D 9H JC 5D 7H 7C 5H
	KD KC 9S 5S AD QC KH 3H
	2S KS 9D QD JS AS AH 3C
	4C 5C TS QH 4H AC 4D 7S
	3S TD 4S TH 8H 2C JH 7D
	6D 8S 8D QS 6C 3D 8C TC
	6S 9C 2H 6H

	*/
	function reset() {
		var t = document.querySelectorAll('[data-clearonreset]');
		for (var i = 0; i < t.length; i++) {
			t[i].textContent = '';
		}

		cardToColumn(1, 'JD');
		cardToColumn(1, 'KD');
		cardToColumn(1, '2S');
		cardToColumn(1, '4C');
		cardToColumn(1, '3S');
		cardToColumn(1, '6D');
		cardToColumn(1, '6S');
	
		cardToColumn(2, '2D');
		cardToColumn(2, 'KC');
		cardToColumn(2, 'KS');
		cardToColumn(2, '5C');
		cardToColumn(2, 'TD');
		cardToColumn(2, '8S');
		cardToColumn(2, '9C');
	
		cardToColumn(3, '9H');
		cardToColumn(3, '9S');
		cardToColumn(3, '9D');
		cardToColumn(3, 'TS');
		cardToColumn(3, '4S');
		cardToColumn(3, '8D');
		cardToColumn(3, '2H');
	
		cardToColumn(4, 'JC');
		cardToColumn(4, '5S');
		cardToColumn(4, 'QD');
		cardToColumn(4, 'QH');
		cardToColumn(4, 'TH');
		cardToColumn(4, 'QS');
		cardToColumn(4, '6H');
	
		cardToColumn(5, '5D');
		cardToColumn(5, 'AD');
		cardToColumn(5, 'JS');
		cardToColumn(5, '4H');
		cardToColumn(5, '8H');
		cardToColumn(5, '6C');
	
		cardToColumn(6, '7H');
		cardToColumn(6, 'QC');
		cardToColumn(6, 'AS');
		cardToColumn(6, 'AC');
		cardToColumn(6, '2C');
		cardToColumn(6, '3D');
	
		cardToColumn(7, '7C');
		cardToColumn(7, 'KH');
		cardToColumn(7, 'AH');
		cardToColumn(7, '4D');
		cardToColumn(7, 'JH');
		cardToColumn(7, '8C');
	
		cardToColumn(8, '5H');
		cardToColumn(8, '3H');
		cardToColumn(8, '3C');
		cardToColumn(8, '7S');
		cardToColumn(8, '7D');
		cardToColumn(8, 'TC');
	
		addDraggableToMovableCards();
	}

	document.getElementById('resetbtn').addEventListener('click', reset);
	reset();
});