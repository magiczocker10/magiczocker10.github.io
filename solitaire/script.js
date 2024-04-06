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
	var isNintendo = false;
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
		for (var a=0; a<e.length; a++) {
			e[a].removeAttribute('draggable');
			e[a].removeAttribute('data-clicked');
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
		var lC = document.getElementById('storageOpen').lastChild;
		if (lC) {
			lC.setAttribute('draggable', 'true');
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
		function click_(e) {
			e.preventDefault();
			if (e.target.parentElement.id !== 'column0') {return;}
			var sO = document.getElementById('storageOpen');
			sO.appendChild(e.target);
			e.target.setAttribute('data-index', sO.children.length - 1);
			addDraggableToMovableCards();
		}
		cardDiv.addEventListener('click', click_);
		//cardDiv.addEventListener('touchstart', click_);
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
			e.target.style.left = e.target.offsetLeft + 'px';
			e.target.style.top = e.target.offsetTop + 'px';
            e.target.parentElement.children[j].setAttribute('data-drag', '.');
        }
    };
	var t = document.querySelectorAll('div[data-istarget]');
    for (var i = 0; i < t.length; i++) {
        t[i].addEventListener('dragstart', _f);
        t[i].addEventListener('touchstart', _f);
    }
	document.getElementById('storageOpen').addEventListener('dragstart', _f);
	document.getElementById('storageOpen').addEventListener('touchstart', _f);

	function cZeroclick(e){
		if (e.target.id !== 'column0') {return;}
		var cards = document.getElementById('storageOpen');
		while (cards.children.length) {
			e.target.appendChild(cards.children[0]);
		}
	}
	document.getElementById('column0').addEventListener('click', cZeroclick);
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
		var cards = [];
		var cL = Object.keys(colorLookup);
		var t = document.querySelectorAll('[data-clearonreset]');
		var cols = document.getElementsByClassName('column');
		var i;
		var card;
		for (i = 0; i < t.length; i++) {
			t[i].textContent = '';
		}
		for (i = 0; i < charIndex.length; i++) {
			for (var k = 0; k < cL.length; k++) {
				cards.push(charIndex.substring(i, i + 1) + cL[k]);
			}
		}
		for (i = 0; i < 100; i++) {
			card = Math.floor(Math.random() * cards.length);
			var tmp = cards[card];
			cards.splice(card, 1);
			cards.push(tmp);
		}
		for (i = 0; i < cols.length; i++) {
			for (var m = 0; m <= i; m++) {
				card = Math.floor(Math.random() * cards.length);
				cardToColumn(i + 1, cards[card]);
				cards.splice(card, 1);
			}
		}
		for (i = 0; i < cards.length; i++) {
			cardToColumn(0, cards[i]);
		}
		addDraggableToMovableCards();
	}

	document.getElementById('resetbtn').addEventListener('click', reset);
	reset();
});