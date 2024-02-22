var player = false;
var won = false;
var field = document.getElementById('field').rows;

function getType(x, y) {
	return field[y].cells[x].getAttribute('data-type');
}

function checkWin() {
	for (var i = 0; i < 3; i++) {
		// horizontal
		if ((getType(0, i) === getType(1, i)) &&
			(getType(0, i) === getType(2, i)) &&
		   	(getType(0, i) !== '0')) {
			won = true;
		} else

		// vertical
		if ((getType(i, 0) === getType(i, 1)) &&
			(getType(i, 0) === getType(i, 2)) &&
		   	(getType(i, 0) !== '0')) {
			won = true;
		}
	}

	// diagonal \
	if ((getType(0, 0) === getType(1, 1)) &&
		(getType(1, 1) === getType(2, 2)) &&
	   	(getType(0, 0) !== '0')) {
		won = true;
	} else

	// diagonal /
	if ((getType(2, 0) === getType(1, 1)) &&
		(getType(1, 1) === getType(0, 2)) &&
	   	(getType(2, 0) !== '0')) {
		won = true;
	}
	
}

document.getElementById('field').addEventListener('click', function(e) {
	var type = e.target.getAttribute('data-type');
    if (!won && type === '0') {
        e.target.setAttribute('data-type', (player ? 2 : 1));
		checkWin();
		if (won) alert((player ? 'o' : 'x') + ' won');
		player = !player;
    }
}, false);

document.getElementById('button').addEventListener('click', function() {
	var cells = document.getElementsByTagName('td');
	for (var i=0; i<cells.length; i++) {
		cells[i].setAttribute('data-type', 0);
	}
	won = false;
}, false);