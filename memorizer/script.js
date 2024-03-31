// jshint jquery:false, browser:true, devel:true, camelcase:true, curly:false, eqeqeq:true, esversion: 5, forin:true, freeze:true, immed:true, latedef:true, leanswitch:true, newcap:true, noarg:true, regexp:true, strict:true, trailing:false, undef:true, unused:true
window.addEventListener('load', function() {
	'use strict';
    var lightSpeed = 1000;
    var t = document.getElementById('board');
    var order = [];
    var pos = 0;
    var timeout;
    var timeout2;
    var gameStage = 0; // 0 = Show lights, 1 = Clicking
    function clearTimeout_() {
        if (!timeout && !timeout2) {return;}
        if (timeout) { clearTimeout(timeout); }
        if (timeout2) { clearTimeout(timeout2); }
    }
    function showLight(on) {
        if (on) {
            t.setAttribute('data-light', order[pos]);
            clearTimeout_();
            timeout = setTimeout(showLight, lightSpeed, false);
            return;
        }
        pos++;
        t.removeAttribute('data-light');
        if (pos >= order.length) {
            pos = 0;
            gameStage = 1;
        } else {
            clearTimeout_();
            timeout = setTimeout(showLight, lightSpeed * 0.5, true);
        }
    }
    function nextStage() {
        gameStage = 0;
        pos = 0;
        order[order.length] = Math.floor(Math.random() * 4);
        clearTimeout_();
        timeout = setTimeout(showLight, lightSpeed, true);
    }
    function reset() {
        pos = 0;
        order = [];
        clearTimeout_();
        nextStage();
    }
    function click(e) {
        if (gameStage < 1) {return;}
        var c = Number(e.target.getAttribute('data-col'));
        if (c === ' ') {return;}
        if (c === order[pos]) {
            pos++;
            gameStage = 0;
            t.setAttribute('data-light', c);
            clearTimeout_();
            timeout = setTimeout(function() {
                t.removeAttribute('data-light');
                gameStage = 1;
            }, lightSpeed);
            if (pos >= order.length) {
                timeout2 = setTimeout(nextStage, lightSpeed);
            }
        } else {
            alert('Wrong click');
            reset();
        }
    }
    t.textContent = '';
    var s = '00110  12  32233';
    for (var i = 0; i < 4; i++) {
        var r = t.insertRow();
        for (var j = 0; j < 4; j++) {
            var c = r.insertCell();
            c.setAttribute('data-col', s.substring(i * 4 + j, i * 4 + j + 1));
            c.addEventListener('click', click);
        }
    }
    document.getElementById('resetbtn').addEventListener('click', reset);
    reset();
});