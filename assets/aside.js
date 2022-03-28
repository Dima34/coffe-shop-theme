const idList = []
const collections = document.querySelectorAll(".collection");
const halfOfScreenHeight = window.innerHeight / 2;
const asideButtons = document.querySelectorAll(".aside-button");
let active;

collections.forEach(el=>{
	id = el.getAttribute("id");
	idList.push(id)
})

function clearClasses(buttonList){
	buttonList.forEach(el=>{
		if(el.classList.contains("active")){
			el.classList.remove("active")
		}
	})
}

function scrollToCords(x){

	window.scrollTo({
		top: x,
		behavior: "smooth"
	});
}

window.addEventListener("scroll", ()=>{
	window.requestAnimationFrame(()=>{
		collections.forEach(el=>{
			const fromTop = el.getBoundingClientRect().top;

			if(fromTop <= halfOfScreenHeight){
				active = el;				
			}
		})

		let queryString = `[href="#${active.getAttribute("id")}"]`;
		let activeButton = document.querySelector(queryString)
	
		clearClasses(asideButtons)
		activeButton.classList.add("active")
	})
})

asideButtons.forEach(button=>{
	button.addEventListener("click", (e)=>{
		e.preventDefault();
		let id = button.getAttribute("href").slice(1);

		let destBlock = document.getElementById(id);
		let headerHeight = 75;
		let topOfDestBlock = destBlock.getBoundingClientRect().top + window.scrollY - headerHeight;
		
		scrollToCords(topOfDestBlock)
	})
})