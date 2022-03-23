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

function deleteitem(event, id) {
	event.preventDefault()
	
	makeUpdateRequest({[id] : 0})
}

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function makeUpdateRequest(updateObj, sectionLine) {
	return new Promise(function(resolve, reject) {
		let formData = {
			'updates': updateObj
		};

		console.log(sectionLine);
	
		fetch(window.Shopify.routes.root + 'cart/update.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		}).then(()=>{
			makeSectionRequest(sectionLine).then(resolve)
		})
		.catch((error) => {
			console.error('Error:', error);
		});
  })	
}

function makeSectionRequest(sectionName){
	return new Promise(function(resolve, reject) {
		fetch(window.Shopify.routes.root + `?sections=${sectionName}`)
		.then((response) => {
			response.json().then((section) => {
				rerenderSections(section).then(resolve)
			});
		})
	})	
}

function rerenderSections(sections) {
	return new Promise((resolve, reject)=>{
		for (key in sections) {
			let newSection = htmlToElement(sections[key])
			let sectionId = newSection.getAttribute("id")
	
			let oldSection = document.getElementById(sectionId);
			console.log(newSection);
			oldSection.replaceWith(newSection)
		}

		console.log(`section rerendered`);
		resolve()
	})
}
