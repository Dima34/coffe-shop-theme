function makePostRequest(body) {
	return new Promise((resolve, reject)=>{
		fetch(window.Shopify.routes.root + 'cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(res => { 
			res.json().then(data=>{console.log(data); rerenderSections(data.sections).then(resolve()) })
		})
		.catch((error) => {
			console.error('Error:', error);
			reject(error)
		});
	})
}

function addItemToCart(id) {
	enableLoading()

	let formData = {
		'items': [{
		 'id': id,
		 'quantity': 1
		}],
		sections: "footer"
	};

	makePostRequest(formData).then(()=>(setTimeout(disableLoading, 500)));
}

function deleteItem(id) {
	enableLoading()
	
	makeUpdateRequest({[id]:0}, sectionsToUpdate)
		.then(main)
		.then(()=>(setTimeout(disableLoading, 500)))
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
			oldSection.replaceWith(newSection)
		}

		resolve()
	})
}
