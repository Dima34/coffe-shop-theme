let timeout;
let quantityBlocks
let sectionsToUpdate = "cart-header,cart-main"

function quantityBlocksUpdate(){
	quantityBlocks = document.querySelectorAll(".cart-item__quantity-selection")
}

function startCount(callback){
	clearInterval(timeout)
	timeout = setTimeout(callback, 1000);
}

function checkButtonsAndStartCount(input, increaseBtn, decreaseBtn, min, max) {
	startCount(()=>{updateCart(quantityBlocks).then(main)})
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

function updateCart(quantityBlocks) {
	return new Promise(function(resolve, reject) {
		let queryObject = {}

		quantityBlocks.forEach(block => {
			let id = Number(block.getAttribute("data-item-id"))
			let value = block.querySelector("input").value
	
			queryObject[id] = value
		});

    makeUpdateRequest(queryObject, sectionsToUpdate).then(resolve)
  })
}

function deleteItem(id) {
	makeUpdateRequest({[id]:0}, sectionsToUpdate).then(main)
}

function main(){
	quantityBlocksUpdate()
	let cartRemoveButtons = document.querySelectorAll("[data-cart-remove]")

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

	cartRemoveButtons.forEach(removeButton =>{
		removeButton.addEventListener("click",(event, removeButtonElem = removeButton)=>{
			event.preventDefault();

			let id = removeButtonElem.getAttribute("data-item-id")
			deleteItem(id)
		})
	})
}

quantityBlocksUpdate()
main()







