import { getRecipes } from "./recipes.js";

function element(tag, attributes = {}, children = []) {
	const element = document.createElement(tag);

	Object.entries(attributes).forEach(([key, value]) => {
		if (key.startsWith("on")) {
			const eventName = key.toLowerCase().substring(2);
			element.addEventListener(eventName, value);
		} else {
			element.setAttribute(key, value);
		}
	});

	children.forEach((child) => {
		if (typeof child === "string") {
			element.appendChild(document.createTextNode(child));
		} else {
			element.appendChild(child);
		}
	});
	return element;
}

function createContainer({ onShow }) {
	const container = element("div", { class: "container" }, [
		element("h1", {}, ["My Recipes"]),
		element("button", { class: "btn btn-primary", onClick: onShow }, [
			"Show Recipes",
		]),
		element("div", { id: "recipeList" }),
	]);
	return container;
}

export function setupApp(root) {
	let isVisible = false;

	function handleShow(event) {
		isVisible = !isVisible;
		const list = event.target.parentNode.querySelector("#recipeList");
		list.classList.add("row", "gap-4");

		if (isVisible) {
			makeRecipeCards().forEach((card) => list?.appendChild(card));
		} else {
			list.innerText = "";
		}
	}

	root.appendChild(createContainer({ onShow: handleShow }));
	return root;
}

// this function makes the cards for each recipe
const makeRecipeCards = () => {
	const cards = getRecipes().map((recipe) => {
		return element("div", { class: "card col-12 col-lg mt-3 px-0" }, [
			element("div", { class: "card-header text-center" }, [
				element("h4", {}, [recipe.name]),
			]),
			element("div", { class: "card-body" }, [
				element("div", { class: "row" }, [
					element("div", {}, [
						element("span", { class: "fw-bold" }, ["Serving: "]),
						element("span", {}, [`${recipe.servings}`]),
					]),
				]),
				element("div", { class: "row" }, [
					element("div", {}, [
						element("span", { class: "fw-bold" }, ["Preparation time: "]),
						element("span", {}, [`${recipe.preparation_time}`]),
					]),
				]),
				element("h5", { class: "mt-2" }, ["Ingredients"]),
				createLists(recipe.ingredients, "ingredients"),
				element("h5", { class: "mt-2" }, ["Instructions"]),
				createLists(recipe.instructions, "Instructions"),
			]),
		]);
	});
	return cards;
};

// this function creates the lists
const createLists = (inputArray, typeOfArray) => {
	let resultListItems;

	// checks which list do we want to make. The only difference is in the output formatting.
	if (typeOfArray === "ingredients") {
		//here the function creates an array with the items of the ingredients list
		resultListItems = inputArray.map((inputArrayItem) => {
			return element("li", {}, [
				inputArrayItem.item,
				" | ",
				inputArrayItem.quantity,
			]);
		});
	} else {
		// here the function creates an array with the items of the instructions list
		resultListItems = inputArray.map((inputArrayItem) => {
			return element("li", {}, [inputArrayItem]);
		});
	}

	//here i create the root element of the list
	const resultList = element("ul", { style: "min-height: 12rem" }, []);

	//here i go through the list items array and for every item I append it to the root of the list
	resultListItems.forEach((item) => {
		resultList.appendChild(item);
	});

	//returning the created list
	return resultList;
};
