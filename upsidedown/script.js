const button = document.getElementById('convert');
const unicode = document.getElementById('unicode');
const input = document.getElementById('input');
const output = document.getElementById('output');

const charMap = [
	{ // 1.13 - 1.19 .json files
		' ': ' ', '!': '\\u00a1', '"': '', '#': '#', '$': '$', '%': '%', '&': '\\u214b', "'": ',',
		'(': ')', ')': '(', '*': '*', '+': '+', ',': '\\u2018', '-': '-', '.': '\\u02d9', '/': '/',
		'0': '0', '1': '\\u295d', '2': '\\u1614', '3': '\\u0190', '4': '\\u07c8', '5': '\\u03db', '6': '9', '7': '\\u3125',
		'8': '8', '9': '6', ':': ':', ';': '', '<': '>', '=': '=', '>': '<', '?': '\\u00bf',
		'@': '', A: '\\u2c6f', B: '\\u15fa', C: '\\u0186', D: '\\u15e1', E: '\\u018e', F: '\\u2132', G: '\\u2141',
		H: 'H', I: 'I', J: '\\u0550', K: '\\ua7b0', L: '\\ua780', M: 'W', N: 'N', O: 'O',
		P: '\\u0500', Q: '\\ua779', R: '\\u1d1a', S: 'S', T: '\\u27d8', U: '\\u2229', V: '\\u0245', W: 'M',
		X: 'X', Y: '\\u2144', Z: 'Z', '[': ']', '\\': '\\', ']': '[', '^': '', '_': '',
		'`': '', a: '\\u0250', b: 'q', c: '\\u0254', d: 'p', e: '\\u01dd', f: '\\u025f', g: '\\u1d77',
		h: '\\u0265', i: '\\u1d09', j: '\\u027e', k: '\\u029e', l: '\\ua781', m: '\\u026f', n: 'u', o: 'o',
		p: 'd', q: 'b', r: '\\u0279', s: 's', t: '\\u0287', u: 'n', v: '\\u028c', w: '\\u028d',
		x: 'x', y: '\\u028e', z: 'z', '{': '}', '|': '|', '}': '{', '~': '~'
	},
	{ // 1.9 - 1.12 .lang files and 1.19.3+ .json files
		' ': ' ', '!': '¡', '"': '', '#': '#', '$': '$', '%': '%', '&': '⅋', "'": ',',
		'(': ')', ')': '(', '*': '*', '+': '+', ',': '‘', '-': '-', '.': '˙', '/': '/',
		'0': '0', '1': '⥝', '2': 'ᘔ', '3': 'Ɛ', '4': '߈', '5': 'ϛ', '6': '9', '7': 'ㄥ',
		'8': '8', '9': '6', ':': ':', ';': '', '<': '>', '=': '=', '>': '<', '?': '¿',
		'@': '@', A: 'Ɐ', B: 'ᗺ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁',
		H: 'H', I: 'I', J: 'Ր', K: 'Ʞ', L: 'Ꞁ', M: 'W', N: 'N', O: 'O',
		P: 'Ԁ', Q: 'Ꝺ', R: 'ᴚ', S: 'S', T: '⟘', U: '∩', V: 'Ʌ', W: 'M',
		X: 'X', Y: '⅄', Z: 'Z', '[': ']', '\\': '\\', ']': '[', '^': '', '_': '',
		'`': '', a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ᵷ',
		h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'ꞁ', m: 'ɯ', n: 'u', o: 'o',
		p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ',
		x: 'x', y: 'ʎ', z: 'z', '{': '}', '|': '|', '}': '{', '~': '~'
	}
];

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

button.addEventListener('click', function() {
	const text = input.value.split('\n');
	const isJson = isJsonString(input.value);
	output.value = '';
	text.forEach(function (line) {
		let outputWords = '';
		const words = isJson ? line.match(/(^.+: ")(.+)(")/) : line.match(/(.+)=(.+)/);
		if (words) {
			const split = words[2].split('');
			for (var i = 0; i<split.length; i++) {
				const tmp = split[i];
				const char = charMap[unicode.checked ? 1 : 0][tmp];
				if (!char) console.log('[UpsideDown]', 'Unknown char "' + tmp + '"');
				outputWords = (char || tmp) + outputWords;
			}
			outputWords = outputWords.replaceAll('s%', '%s');
			outputWords = outputWords.replaceAll('s$⥝%', '%1$s');
			outputWords = outputWords.replaceAll('s$ᘔ%', '%2$s');
			output.value += words[1] + (isJson ? outputWords + words[3] : '=' + outputWords) + ',' + '\n';
		} else {
			output.value += line + '\n';
		}
	});
});