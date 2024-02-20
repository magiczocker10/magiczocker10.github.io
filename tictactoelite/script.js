var player = false;
var won = false;

function getType(ele) {
	return ele.getAttribute('data-type');
}

document.getElementById('field').addEventListener('click', function(e) {
	var type = getType(e.target);
    if (!won && Number(type)) {
        e.target.setAttribute('data-type', (player ? 'o' : 'x'));
		var rows = document.getElementById('field').rows;
        for (var i = 0; i < 3; i++) {
			if (getType(rows[i].cells[0]) === getType(rows[i].cells[1]) && getType(rows[i].cells[0]) === getType(rows[i].cells[2])) { // Horizontal
				won = true;
			} else if (getType(rows[0].cells[i]) === getType(rows[1].cells[i]) && getType(rows[0].cells[i]) === getType(rows[2].cells[i])) { // Vertikal
				won = true;
			}
		}
		if (getType(rows[0].cells[0]) === getType(rows[1].cells[1]) && getType(rows[1].cells[1]) === getType(rows[2].cells[2])) { // Diagonal \
			won = true;
		} else if (getType(rows[0].cells[2]) === getType(rows[1].cells[1]) && getType(rows[1].cells[1]) === getType(rows[2].cells[0])) { // Diagonal /
			won = true;
		}
		if (won) alert((player ? 'o' : 'x') + ' won');
		player = !player;
    }
}, false);

document.getElementById('button').addEventListener('click', function() {
	var rows = document.getElementById('field').rows;
	for (var i=0; i<rows.length; i++) {
		for (var j=0; j<rows[i].cells.length; j++) {
			rows[i].cells[j].setAttribute('data-type', (3 * i + j + 1));
		}
	}
	won = false;
}, false);