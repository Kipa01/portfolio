window.onload = function () {
	try {
		TagCanvas.Start('skillsCanvas', '', {
			textColour: '#57cbff',
			outlineColour: 'transparent',
			reverse: false,
			depth: 0.5,
			maxSpeed: 0.3,
			initial: [0.1, -0.1],
			decel: 0.99,
			repeatTags: 2,
			shadow: '#57cbff',
			shadowBlur: 8,
			textFont: 'MonumentExtended',
			weightMode: 'both',
			noSelect: true,
			wheelZoom: false
		});
	} catch (e) {
		document.getElementById('skills__animation').style.display = 'none';
	}
};