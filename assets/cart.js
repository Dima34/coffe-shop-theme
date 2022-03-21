const updateButton = document.getElementById("update-cart")
const increaseButtons = document.querySelectorAll(".cart-item__quantity-increase")
const decreaseButtons = document.querySelectorAll(".cart-item__quantity-decrease")
const inputs = document.querySelectorAll(".cart-item__quantity-selection input")
let timeout;

function updateCart() {
	updateButton.click()
}

function count(){
	clearInterval(timeout)
	timeout = setTimeout(updateCart, 1000);
}

function interaction(button, increase){
	const input = button.parentNode.querySelector("input")
	const min = 1;

	button.addEventListener("click", (e)=>{
		e.preventDefault()
		count()

		if(increase){
			input.value++
		}else{
			input.value <= min ? input.value = min : input.value--
		}
	})
}

inputs.forEach(input=>{
	input.addEventListener("change", ()=>{
		count();
	})
})

increaseButtons.forEach(button=>{
	interaction(button, true)
})

decreaseButtons.forEach(button=>{
	interaction(button)
})



