function addClass(e, c) {
	var l = e.className.split(' ');
	if (l.indexOf(c) < 0) l.push(c);
	e.className = l.join(' ');
}
function removeClass(e, c) {
	var l = e.className.split(' ');
	var i = l.indexOf(c);
	if (i > -1) l.splice(i, 1);
	e.className = l.join(' ');
}
function hasClass(e, c) {
	var l = e.className.split(' ');
	return l.indexOf(c) > -1;
}
function getSelection(e) {
	return e.options[e.selectedIndex];
}