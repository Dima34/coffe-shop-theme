const loading = document.getElementById("loading")
console.log(`loading`);

function enableLoading(){
	loading.classList.add("active")
}

function disableLoading(){
	loading.classList.remove("active")
	console.log(`Disable`);
}