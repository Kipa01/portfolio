const links = document.querySelectorAll("[data-scroll]");

links.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		const dataScroll = e.target.getAttribute("data-scroll");
		const offsetTop = document.querySelector(dataScroll).offsetTop;

		scroll({
			top: offsetTop,
			behavior: "smooth"
		});
	});
});