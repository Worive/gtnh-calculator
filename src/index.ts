import "./data/repository.js";
import "./ui/recipeBox.js";
import "./ui/iconBox.js";
import "./ui/tooltip.js";
import "./ui/nei.js";
import { ShowNei, ShowNeiMode } from "./ui/nei.js";

document.getElementById("loading")?.remove();

ShowNei(null, ShowNeiMode.Production);