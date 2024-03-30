window.addEventListener('load', function() {
	var tData = [
		"a–––––b–––––c",
		"|     |     |",
		"| d–––e–––f |",
		"| |   |   | |",
		"| | g–h–i | |",
		"| | |   | | |",
		"j–k–l   n–o–p",
		"| | |   | | |",
		"| | q–r–s | |",
		"| |   |   | |",
		"| t–––u–––v |",
		"|     |     |",
		"w–––––x–––––y"
	];
	var statusEle = document.querySelector("#status");
	var isBlack = false; // Current player
	var stonesToPlace = [9, 9]; // Black, White
	var gameStage = 0; // 0 = Placing, 1 = Moving, 2 = Winning
	var hasMill = false;
	var clicked;
	var t = document.querySelector("#board")
	function isValidMove(s, d) { // source, destination
		if (d.dataset.color !== "" || s === d) {return false;}
		if (s.parentElement.rowIndex === d.parentElement.rowIndex) {
			return Math.abs(s.dataset.field.charCodeAt(0) - d.dataset.field.charCodeAt(0)) === 1;
		}
		if (s.dataset.column === d.dataset.column) {
			var _ = Array.from(document.querySelectorAll('td[data-column="' + s.dataset.column + '"]'));
			return Math.abs(_.indexOf(s) - _.indexOf(d)) === 1;
		}
		return false;
	}
	function updateStatusBar() {
		if (gameStage === 2) {
			statusEle.innerText = 'Player ' + (isBlack ? "Black" : "White") + ' has won the game!';
		} else if (hasMill) {
			statusEle.innerText = "Player " + (isBlack ? "Black" : "White") + " has a mill. Please remove a opponent stone.";
		} else {
			statusEle.innerText = "Current Player: " + (isBlack ? "Black" : "White") + '(' + (gameStage === 0 ? "Placing" : (gameStage === 1 ? "Moving" : "Ended")) + ')';
		}
	}
	function isMill(p) { // pos
		var c = p.dataset.color;
		if (document.querySelectorAll('td[data-column="' + p.dataset.column + '"][data-color="' + c + '"]').length === 3 ||
			document.querySelectorAll('td[data-row="' + p.dataset.row + '"][data-color="' + c + '"]').length === 3) {
			return true;
		}
		return false;
	}
	function isTakable(p) {
		if (!isMill(p)) {return true;}
		var hasOnlyMillStones = true;
		document.querySelectorAll('td[data-color="' + p.dataset.color + '"').forEach(function(s) {
			if (!isMill(s)) {
				hasOnlyMillStones = false;
			}
		});
		return hasOnlyMillStones;
	}
	function hasMovableStones(c) { // Color
		var result = false;
		document.querySelectorAll('td[data-color="' + c + '"]').forEach(function(s) {
			document.querySelectorAll('td[data-column="' + s.dataset.column + '"]').forEach(function(s2) {
				if (isValidMove(s, s2)) {
					result = true;
				}
			});
			document.querySelectorAll('td[data-row="' + s.dataset.row + '"]').forEach(function(r) {
				if (isValidMove(s, r)) {
					result = true;
				}
			});
		});
		return result;
	}
	function click(e) {
		if (gameStage === 2) {return;}
		console.log(e.target);
		var t = e.target;
		var c = (isBlack && "b" || "w");
		if (hasMill) {
			c = (isBlack && "w" || "b");
			if (t.dataset.color === c && isTakable(t)) {
				t.dataset.color = "";
				hasMill = false;
				isBlack = !isBlack;
				updateStatusBar();
			}
			return;
		}
		if (gameStage === 0) {
			if (isBlack) {
				t.dataset.color="b";
				stonesToPlace[0]--;
			} else {
				t.dataset.color="w";
				stonesToPlace[1]--;
			}
			if (isMill(t)) {
				hasMill = true;
			} else {
				isBlack = !isBlack;
			}
			if (stonesToPlace[0] === 0 && stonesToPlace[1] === 0) {
				gameStage = 1;
			}
			updateStatusBar();
			return;
		} else if (t.dataset.color === c) {
			clicked = t;
		} else if (clicked && t.color === "" && isValidMove(clicked, t)) {
			t.dataset.color = c;
			clicked.dataset.color = "";
			clicked = undefined;
			if (isMill(t)) {
				hasMill = true;
			} else {
				isBlack = !isBlack;
			}
			updateStatusBar();
		}
		if (!hasMovableStones("b") || document.querySelectorAll('td[data-color="b"]').length < 3) {
			gameStage = 2;
			isBlack = false;
		}
		if (!hasMovableStones("w") || document.querySelectorAll('td[data-color="w"]').length < 3) {
			gameStage = 2;
			isBlack = true;
		}
	}
	function generateTable() {
		t.innerText='';
		for (var i = 0; i < tData.length; i++) {
			var r = t.insertRow();
			for (var j = 0; j < tData[i].length; j++) {
				var c = r.insertCell();
				c.dataset.color='';
				var _ = tData[i].substring(j, j + 1);
				if (_ >= "a" && _ <= "y") {
					c.innerText = '#';
					c.dataset.field = _;
					c.dataset.column = j + ((j === 6 && i > 6) && 1 || 0);
					c.dataset.row = i + ((i === 6 && j > 6) && 1 || 0);
					c.dataset.color = "";
					c.addEventListener("click", click);
				} else {
					c.innerText = _;
				}
			}
		}
	}
	function reset() {
		isBlack = false;
		hasMill = false;
		stonesToPlace = [9, 9];
		gameStage = 0;
		clicked = undefined;
		updateStatusBar();	
		generateTable();
	}
	reset();
	document.querySelector("#resetbtn").onclick = reset;
});