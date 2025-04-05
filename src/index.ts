import "./repository.js";
import "./itemIcon.js";
import "./tooltip.js";
import "./nei.js";
import "./menu.js";
import "./page.js";
import "./recipeList.js";

// Load the atlas image
const atlas = new Image();
atlas.src = "./data/atlas.webp";
await new Promise((resolve) => {
    atlas.onload = resolve;
});

document.getElementById("loading")?.remove();