function outNum(num, elem, options) {
	const { step, time } = options;

	let n = +(elem.innerHTML);
	let t = Math.round(time / (num / step));

	let interval = setInterval(() => {
		n = n + step;
		elem.innerHTML = n;

		if (n >= num) {
			clearInterval(interval);
			elem.innerHTML = num;
		}
	}, t);
};


const preloader = document.querySelector('.preloader');
const percents = document.querySelector('.preloader__percents');
const main = document.querySelector('main');
let i = 0;

outNum(100, percents, {
	step: 1,
	time: 2000
});

setTimeout(() => {
	preloader.classList.add('hide');
	main.style.opacity = "1";
}, 3500)