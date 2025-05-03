<script lang="ts">
    let { goodId } = $props();


</script>
<item-icon data-id={goodId} class="flow-item"></item-icon>

<style>
    .flow-item {
        top: 2px;
        left: 2px;
        display: block;
    }
</style>