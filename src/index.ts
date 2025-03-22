import { getGuiScale } from "./dpi.js";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root") as HTMLElement;
    const scale = getGuiScale();
    
    root.style.transform = `scale(${scale})`;
    root.style.transformOrigin = "top left"; // Avoid blurriness
    root.style.imageRendering = "pixelated";

    console.log(`GUI Scale set to ${scale}x`);
});