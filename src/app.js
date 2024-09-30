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
		list.classList.add("row", "gap-5");

		if (isVisible) {
			makeRecipeCards().forEach((card) => list?.appendChild(card));
		} else {
			list.innerText = "";
		}
	}

	root.appendChild(createContainer({ onShow: handleShow }));
	return root;
}

const makeRecipeCards = () => {
	const cards = getRecipes().map((recipe) => {
		return element(
			"div",
			{ class: "card col mt-3 px-0", style: "width:18rem" },
			[
				element("div", { class: "card-header text-center" }, [
					element("h3", {}, [recipe.name]),
				]),
				element("div", { class: "card-body" }, [
					element("div", { class: "row" }, [
						element("div", { class: "col" }, [`Serving: ${recipe.servings}`]),
					]),
					element("div", { class: "row" }, [
						element("div", { class: "col" }, [
							`Preparation time: ${recipe.preparation_time}`,
						]),
					]),
					element("h4", { class: "mt-2" }, ["Ingredients"]),
					createIngredientList(recipe.ingredients),
					element("h4", { class: "mt-2" }, ["Instructions"]),
					element("ul", {}, [
						element("li", {}, ["valami1"]),
						element("li", {}, ["valami2"]),
						element("li", {}, ["valami3"]),
						element("li", {}, ["valami4"]),
					]),
				]),
			]
		);
	});
	return cards;
};

// this function creates the ingredients list
const createIngredientList = (ingredients) => {
	//here the function creates an array with the items of the ingredients list
	const ingredientListItems = ingredients.map((ingredient) => {
		return element("li", {}, [ingredient.item, " | ", ingredient.quantity]);
	});

	//here i create the root element of the list
	const ingredientList = element("ul", { style: "min-height: 12rem" }, []);

	//here i go through the list items array and for every item I append it to the root of the list
	ingredientListItems.forEach((item) => {
		ingredientList.appendChild(item);
	});

	//returning the created list
	return ingredientList;
};

const createInstructionList = () => {};
