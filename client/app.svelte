<script lang="ts">
  import { onMount } from "svelte";
  import wasm_init, { xxxx } from "@krist7599555/my-webgl-lib";

  onMount(() => {
    wasm_init()
      .then(() => {
        console.log("INIT SUCCESS");
        console.log(">>>>>", xxxx());
      })
      .catch((err) => {
        console.error("ERROR");
        console.error(err);
      });
  });
</script>

<canvas id="canvas" />
