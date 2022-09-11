import Swiper, { EffectCoverflow, Keyboard } from 'swiper';

new Swiper('.swiper', {
	modules: [EffectCoverflow, Keyboard],
	effect: "coverflow",
	grabCursor: true,
	centeredSlides: true,
	slidesPerView: "auto",
	loop: true,
	keyboard: {
		enabled: true,
		onlyInViewport: true,
	},
	coverflowEffect: {
		rotate: 50,
		stretch: 0,
		depth: 100,
		modifier: 1,
		slideShadows: true,
	},
});