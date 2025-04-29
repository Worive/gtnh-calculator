<script lang="ts">
    import {onMount} from "svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";

    onMount(async () => {
        await import('$lib/legacy/index.ts');
    });
</script>

<div style="height: 100%">
    <button class="menu-toggle">☰</button>

    <div id="main">
        <div id="menu" class="menu-container visible">
            <div class="logo">Greg Tech: New Horizons Calculator</div>
            <div class="menu-links">
                <a href="#" id="nei-link">NEI</a>•
                <a href="https://github.com/ShadowTheAge/gtnh/" target="_blank">Github</a>•
                <a href="https://gtnh.miraheze.org/" target="_blank">Wiki</a>•
                <a href="https://docs.google.com/spreadsheets/d/1EIZtJU5eBbnUlrg7fD_ZyIzsr9sn4l4no9ek6M_iSVM" target="_blank">Spreadsheet</a>
            </div>
            <div class="menu-pages">
                <div class="header"><h2 style="display: inline;">Pages</h2> (<a href="#" id="load-file">Load from file</a>)</div>
                <div class="page-list">
                    <!-- Page buttons will be inserted here -->
                </div>
            </div>
            <span class="text-small">Pages are stored in local storage. This may not be reliable. Please save important pages as files or URLs.</span>
            <div class="new-page-widget">
                <h2>New Page</h2>
                <div class="new-page-form">
                    <input type="text" data-action="page-name-input" placeholder="Page name">
                    <button data-action="create-page">Create</button>
                </div>
            </div>
        </div>
        <div id="recipe-list">
            <div class="status-message"></div>
            <div class="header"><h2>Products: <span class="text-small">(You can use negative amounts for input goal)</span></h2></div>
            <div class="product-items"></div>
            <div class="header"><h2>Recipes:</h2></div>
            <div class="recipe-list"></div>
            <span class="text-small" style="color: #666;">
                All icons and related materials featured on this website are the property of their respective copyright holders. 
                This site does not claim ownership of these materials. They are used here for informational and illustrative purposes only. 
                All trademarks and copyrights belong to their respective owners. 
                Font used: <a href="https://www.fontspace.com/f77-minecraft-font-f30628" style="text-decoration: none;">F77 Minecraft by 123467</a>
            </span>
        </div>
    </div>

    <div id="panels">
        <div id="nei" class="hidden panel-tab-container">
            <div class="panel-tab-bar">
                <div id="nei-tabs" class="panel-tabs"></div>
            </div>
            <div class = "panel">
                <div class="hgroup">
                    Search:
                    <input id="nei-search" placeholder="Start typing for search">
                    <button id="nei-back">←</button>
                    <button id="nei-close">x</button>
                </div>
                <div class="scroll-area" id="nei-scroll">
                    <div id="nei-content"></div>
                </div>
            </div>
        </div>

        <ConfirmDialog/>

        <div id="loading" class="panel"><h1>LOADING...</h1>First time loading may take a while.<br>(Downloading 30MB of data)</div>
    </div>

    <Tooltip/>

    <div id="dropdown">

    </div>
</div>