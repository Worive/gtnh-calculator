// keep the file a module even though everything is now inside a function
import {NeiService} from "$lib/services/nei.service";

export {};

// run everything inside a self-executing async function
(async () => {
    const loading = document.getElementById("loading") as HTMLElement;

    try {
        /* ---------- 1. load the atlas image ---------- */
        const atlas = new Image();
        atlas.src = "/data/atlas.webp";
        // optional: wait until it is decoded so subsequent code can use it safely
        await atlas.decode();

        /* ---------- 2. load repository + binary data in parallel ---------- */
        const [repositoryModule, response] = await Promise.all([
            import("./repository.js"),
            fetch(new URL("/data/data.bin", import.meta.url)) // avoids resolve() in older bundlers
        ]);

        const stream = response.body!
            .pipeThrough(new DecompressionStream("gzip"));
        const buffer = await new Response(stream).arrayBuffer();
        repositoryModule.Repository.load(buffer);
        console.log("Repository loaded", repositoryModule.Repository.current);

        NeiService.initialize();
        /* ---------- 3. lazy-load the rest of the UI modules ---------- */
        await Promise.all([
            import("./itemIcon.js"),
            import("./nei.js"),
            import("./menu.js"),
            import("./recipeList.js")
        ]);

        const page = await import("./page.js");
        page.UpdateProject();

        /* ---------- 4. done: remove the spinner ---------- */
        loading.remove();
    } catch (err: any) {
        loading.innerHTML =
            "An error occurred while loading:<br>" + err.message;
        console.error(err);
    }
})();
