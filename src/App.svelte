<script>
  let gainValue = 0;
  let bypass = false;
  export let update;
  export let resize;

  const handleBypass = () => {
    bypass = !bypass;
    update('Bypass', bypass ? 1.0 : 0.0);
  }

  const updateParam = (name, value) => {
    update(name, value);
  }

  const handleResize = () => {
    resize();
  }
</script>

<main>
  <input type="range" min="-60" max="36"
    bind:value={gainValue}
    on:input={(e) => updateParam('Gain', parseInt(e.target.value))}
  >
  {gainValue.toFixed(0)}dB

  <button on:click={handleBypass}>
    {bypass ? 'un-bypass' : 'bypass'}
  </button>

  <button on:click={handleResize}>
    resize
  </button>
</main>