<template>
  <section class="vehicle-gallery" aria-label="차량 사진">
    <h2>차량 사진</h2>
    <div class="vehicle-gallery__grid">
      <figure v-for="image in orderedImages" :key="image.id" class="vehicle-gallery__item">
        <img :src="withBaseUrl(image.src)" :alt="image.alt" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBaseUrl } from '@/data/fetchVehicleCatalog'
import type { VehicleImage } from '@/types/vehicle'

const props = defineProps<{
  images: VehicleImage[]
}>()

const orderedImages = computed(() => {
  return [...props.images].sort((a, b) => a.sortOrder - b.sortOrder)
})
</script>
