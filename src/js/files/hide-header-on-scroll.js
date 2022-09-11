const header = document.querySelector("header");
let prevScrollpos = window.pageYOffset;

window.onscroll = () => {
	var currentScrollPos = window.pageYOffset;
	if (prevScrollpos > currentScrollPos) {
		header.style.top = "0";
	} else {
		header.style.top = `${-header.getBoundingClientRect().height}px`;
	}
	prevScrollpos = currentScrollPos;
}