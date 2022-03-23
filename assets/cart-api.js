function getCartItems() {
	return	fetch(window.Shopify.routes.root + 'cart.js')
		.then(response => response.json())
}

function makePostRequest(body) {
	console.log(body);
	return fetch(window.Shopify.routes.root + 'cart/add.js', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
	.then(res => { 
		return res.json().then(data=>{console.log(data);  rerenderSections(data.sections)}) 
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function makeSectionRequest(sectionName){
	fetch(window.Shopify.routes.root + "?sections=cart-lineitem")
  .then((response) => {
    return response.json();
  })
  .then((section) => {
    rerenderSections(section)
  });
}

function makeUpdateRequest(id, quantity) {
	let formData = {
		'updates': {
			[id]: quantity
		}
	};

	return fetch(window.Shopify.routes.root + 'cart/update.js', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	}).then(()=>{
		makeSectionRequest("cart-lineitem")
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function addItemToCart(id) {
	let formData = {
		'items': [{
		 'id': id,
		 'quantity': 1
		}],
		sections: "footer"
	};

	makePostRequest(formData)
}

function updateItem(event, id, quantity) {
	event.preventDefault()
	
	makeUpdateRequest(id, quantity)
}


function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function rerenderSections(sections) {

	for (key in sections) {
		let newSection = htmlToElement(sections[key])
		let sectionId = newSection.getAttribute("id")

		let oldSection = document.getElementById(sectionId);
		console.log(newSection);
		oldSection.replaceWith(newSection)
	}
}


