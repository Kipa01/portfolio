let scrollbar = {
	track: document.querySelector(".scrollbar__track"),
	trackShadow: document.querySelector(".scrollbar__shadow"),
};

window.addEventListener("scroll", () => {
	let scrollbarHeight = document.body.scrollHeight - window.innerHeight;
	scrollbar.track.style.height = `${window.scrollY / scrollbarHeight * 100}%`;
	scrollbar.trackShadow.style.height = `${window.scrollY / scrollbarHeight * 100}%`;
});