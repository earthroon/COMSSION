<template>
  <section class="vehicle-gallery" aria-label="차량 사진">
    <div class="vehicle-gallery__heading">
      <div>
        <p class="eyebrow">사진 보기</p>
        <h2>차량 사진</h2>
      </div>
      <p class="vehicle-gallery__mobile-hint">사진을 좌우로 넘겨보세요</p>
    </div>

    <div class="vehicle-gallery__grid" role="list">
      <figure
        v-for="(image, index) in orderedImages"
        :key="image.id"
        class="vehicle-gallery__item"
        role="listitem"
      >
        <img :src="withBaseUrl(image.src)" :alt="image.alt" loading="lazy" />
        <figcaption class="vehicle-gallery__caption">
          <span>{{ index + 1 }} / {{ orderedImages.length }}</span>
          <strong>{{ image.alt }}</strong>
        </figcaption>
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
