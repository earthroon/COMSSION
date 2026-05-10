<template>
  <section class="vehicle-gallery" aria-label="차량 사진">
    <div class="vehicle-gallery__heading">
      <div>
        <p class="eyebrow">사진 보기</p>
        <h2>차량 사진</h2>
      </div>
      <p class="vehicle-gallery__mobile-hint">화살표 버튼으로 사진을 넘겨보세요</p>
    </div>

    <div v-if="activeImage" class="vehicle-gallery__mobile-viewer" aria-live="polite">
      <button
        class="vehicle-gallery__nav vehicle-gallery__nav--prev"
        type="button"
        :disabled="orderedImages.length <= 1"
        aria-label="이전 사진 보기"
        @click="showPrevious"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <figure class="vehicle-gallery__mobile-frame">
        <img :src="withBaseUrl(activeImage.src)" :alt="activeImage.alt" loading="lazy" />
        <figcaption class="vehicle-gallery__mobile-caption">
          <span>{{ activeIndex + 1 }} / {{ orderedImages.length }}</span>
          <strong>{{ activeImage.alt }}</strong>
        </figcaption>
      </figure>

      <button
        class="vehicle-gallery__nav vehicle-gallery__nav--next"
        type="button"
        :disabled="orderedImages.length <= 1"
        aria-label="다음 사진 보기"
        @click="showNext"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div v-if="orderedImages.length > 1" class="vehicle-gallery__tabs" role="tablist" aria-label="차량 사진 선택">
      <button
        v-for="(image, index) in orderedImages"
        :key="image.id"
        class="vehicle-gallery__tab"
        :class="{ 'vehicle-gallery__tab--active': index === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-label="`${index + 1}번 사진 보기: ${image.alt}`"
        @click="activeIndex = index"
      >
        {{ index + 1 }}
      </button>
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
import { computed, ref, watch } from 'vue'
import { withBaseUrl } from '@/data/fetchVehicleCatalog'
import type { VehicleImage } from '@/types/vehicle'

const props = defineProps<{
  images: VehicleImage[]
}>()

const activeIndex = ref(0)

const orderedImages = computed(() => {
  return [...props.images].sort((a, b) => a.sortOrder - b.sortOrder)
})

const activeImage = computed(() => orderedImages.value[activeIndex.value])

watch(
  orderedImages,
  (images) => {
    if (activeIndex.value > images.length - 1) {
      activeIndex.value = 0
    }
  },
  { immediate: true },
)

const showPrevious = () => {
  const length = orderedImages.value.length
  if (length <= 1) return
  activeIndex.value = (activeIndex.value - 1 + length) % length
}

const showNext = () => {
  const length = orderedImages.value.length
  if (length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % length
}
</script>
