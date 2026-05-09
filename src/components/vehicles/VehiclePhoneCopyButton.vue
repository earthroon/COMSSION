<template>
  <button
    type="button"
    class="phone-copy-button"
    :class="{ 'phone-copy-button--compact': compact }"
    :aria-label="`Copy ${contact.label}`"
    @click.prevent.stop="copyPhone"
  >
    <img :src="iconSrc" alt="" aria-hidden="true" />
    <span>{{ statusText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBaseUrl } from '@/data/fetchVehicleCatalog'
import type { VehicleContact } from '@/types/vehicle'

const props = withDefaults(
  defineProps<{
    contact: VehicleContact
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const state = ref<'idle' | 'copied' | 'failed'>('idle')

const iconSrc = computed(() => withBaseUrl(state.value === 'copied' ? 'icons/check.svg' : 'icons/copy.svg'))
const statusText = computed(() => {
  if (state.value === 'copied') return 'Copied'
  if (state.value === 'failed') return 'Failed'
  return props.compact ? 'Copy' : props.contact.phoneDisplay
})

async function copyPhone() {
  if (!props.contact.phoneRaw) return
  try {
    await navigator.clipboard.writeText(props.contact.phoneRaw)
    state.value = 'copied'
  } catch {
    state.value = 'failed'
  }

  window.setTimeout(() => {
    state.value = 'idle'
  }, 1600)
}
</script>
