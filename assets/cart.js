let timeout;
let quantityBlocks = document.querySelectorAll("[data-quantity-block]")
const updateButton = document.getElementById("update-cart")

function updateCart() {
	updateButton.click()
}

function startCount(callback){
	clearInterval(timeout)
	timeout = setTimeout(callback, 1000);
}

function checkButtonsAndStartCount(input, increaseBtn, decreaseBtn, min, max) {
	startCount(updateCart)
	checkButtons(input, increaseBtn, decreaseBtn, min, max)
}

function increaseInputValue(input){
	input.value++
}

function decreaseInputValue(input) {
	input.value--
}

function checkButtons(input, increaseBtn, decreaseBtn, min, max) {
	let inputValue = input.value

	if (max != undefined && max == inputValue ) {
		increaseBtn.disabled = true
	} else{
		if(increaseBtn.disabled){
			increaseBtn.disabled = false;
		}
	}

	if(inputValue <= min){
		decreaseBtn.disabled = true;
	} else{
		if(decreaseBtn.disabled){
			decreaseBtn.disabled = false
		}
	}
}

quantityBlocks.forEach(block=>{
	let increaseBtn = block.querySelector("[data-quantity-increase]")
	let decreaseBtn = block.querySelector("[data-quantity-decrease]")
	let input = block.querySelector("input")
	let min = Number(input.getAttribute("min"))
	let max = undefined

	if(input.getAttribute("max")){
		max = Number(input.getAttribute("max"))
	}

	increaseBtn.addEventListener("click", (e)=>{
		e.preventDefault()

		if(max != undefined){
			if(input.value < max){
				increaseInputValue(input)
			}
		}else {
			increaseInputValue(input)
		}

		checkButtonsAndStartCount(input, increaseBtn, decreaseBtn, min, max)
	})

	decreaseBtn.addEventListener("click", (e)=>{
		e.preventDefault()

		if(input.value > min){
			decreaseInputValue(input)
		}

		checkButtonsAndStartCount(input, increaseBtn, decreaseBtn, min, max)
	})

	input.addEventListener("change", ()=>{
		if(input.value < min){
			input.value = min
		}

		if(input.value > max){
			input.value = max
		}

		checkButtonsAndStartCount(input, increaseBtn, decreaseBtn, min, max)
	})
})