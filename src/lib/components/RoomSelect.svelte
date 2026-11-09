<script lang="ts">
  import { on } from "svelte/events";

  interface IProps {
    onSelect: (deviceId: string) => void;
    devices: MediaDeviceInfo[];
    activeDevice?: string;
    type: MediaDeviceKind;
    icon: string;
    title: string;
  }

  let {
    activeDevice = $bindable(),
    type,
    devices,
    title,
    onSelect,
    icon,
  }: IProps = $props();

  let isOpen = $state(false);
  function clickedoutside(node: HTMLElement) {
    console.log("Added Attachement");
    return on(window, "click", (event) => {
      const target = event.target as Node;
      if (isOpen) {
        // console.log("Running window click event", target);
        if (!node.contains(target)) {
          node.dispatchEvent(
            new CustomEvent("clickedoutside", { bubbles: true }),
          );
        }
        // }
      } else {
        if (node.contains(target)) {
          isOpen = true;
        }
      }
    });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  {@attach clickedoutside}
  onclickedoutside={() => {
    console.log("Clicked Outside the popover");
    isOpen = false;
  }}
  class="flex flex-col gap-x-2 items-center"
>
  {#if isOpen}
    <div class="absolute p-2 w-60 z-10 rounded-md bg-gray-300 bottom-18 left-4">
      <div class="flex flex-col gap-y-2">
        <p>{title}</p>
        {#each devices as device}
          {#if device.kind == type}
            <button
              class="text-start data-[selected=true]:bg-gray-100 p-2 rounded-md"
              value={device.deviceId}
              data-selected={activeDevice == device.deviceId}
              onclick={() => {
                console.log("Clicked me now");
                onSelect(device.deviceId);
              }}>{device.label}</button
            >
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <button type="button" class="flex p-2 border rounded-md items-center w-full h-full gap-x-2">
    <span class="{icon} size-6"></span>

    {#if isOpen}
      <span class="icon-[hugeicons--arrow-up-01] size-6"></span>
    {:else}
      <span class="icon-[hugeicons--arrow-down-01] size-6"></span>
    {/if}
  </button>

  <!-- <select
    onchange={(event) => {
      console.log(event);
      let element = event.target as HTMLSelectElement;
      console.log(element.value);
      onSelect(element.value);
    }}
    class="select w-60 max-w-xs"
  >
    {#each devices as device}
      {#if device.kind == type}
        <option
          value={device.deviceId}
          selected={activeDevice == device.deviceId}>{device.label}</option
        >
      {/if}
    {/each}
  </select> -->
</div>
