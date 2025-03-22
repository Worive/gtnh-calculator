export function getGuiScale(): number {
    const dpi = window.devicePixelRatio || 1;
    return Math.max(2, Math.floor(dpi)); // Ensure an integer scale (1x, 2x, etc.)
}