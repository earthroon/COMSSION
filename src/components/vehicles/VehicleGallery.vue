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
      <figure class="vehicle-gallery__mobile-frame">
        <button
          class="vehicle-gallery__image-button"
          type="button"
          aria-label="사진 크게 보기"
          @pointerdown="rememberPointerStart"
          @pointerup="openLightboxFromPointer($event, activeIndex)"
          @pointercancel="clearPointerStart"
          @click.prevent
          @keydown.enter.prevent="openLightbox(activeIndex)"
          @keydown.space.prevent="openLightbox(activeIndex)"
        >
          <img :src="withBaseUrl(activeImage.src)" :alt="activeImage.alt" loading="eager" decoding="async" />
          <span class="vehicle-gallery__zoom-hint" aria-hidden="true">확대 보기</span>
        </button>

        <button
          class="vehicle-gallery__tap-zone vehicle-gallery__tap-zone--prev"
          type="button"
          :disabled="orderedImages.length <= 1"
          aria-label="이전 사진 보기"
          @pointerdown="rememberNavPointerStart"
          @pointerup="activateNavigationFromPointer($event, 'previous')"
          @pointercancel="clearNavPointerStart"
          @click.prevent
        >
          <span class="sr-only">이전 사진 보기</span>
        </button>

        <button
          class="vehicle-gallery__tap-zone vehicle-gallery__tap-zone--next"
          type="button"
          :disabled="orderedImages.length <= 1"
          aria-label="다음 사진 보기"
          @pointerdown="rememberNavPointerStart"
          @pointerup="activateNavigationFromPointer($event, 'next')"
          @pointercancel="clearNavPointerStart"
          @click.prevent
        >
          <span class="sr-only">다음 사진 보기</span>
        </button>

        <button
          class="vehicle-gallery__nav vehicle-gallery__nav--prev"
          type="button"
          :disabled="orderedImages.length <= 1"
          aria-label="이전 사진 보기"
          @pointerdown="rememberNavPointerStart"
          @pointerup="activateNavigationFromPointer($event, 'previous')"
          @pointercancel="clearNavPointerStart"
          @click.prevent
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          class="vehicle-gallery__nav vehicle-gallery__nav--next"
          type="button"
          :disabled="orderedImages.length <= 1"
          aria-label="다음 사진 보기"
          @pointerdown="rememberNavPointerStart"
          @pointerup="activateNavigationFromPointer($event, 'next')"
          @pointercancel="clearNavPointerStart"
          @click.prevent
        >
          <span aria-hidden="true">›</span>
        </button>

        <figcaption class="vehicle-gallery__mobile-caption">
          <span>{{ activeIndex + 1 }} / {{ orderedImages.length }}</span>
          <strong>{{ activeImage.alt }}</strong>
        </figcaption>
      </figure>
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
        <button
          class="vehicle-gallery__image-button"
          type="button"
          :aria-label="`${image.alt} 크게 보기`"
          @pointerdown="rememberPointerStart"
          @pointerup="openLightboxFromPointer($event, index)"
          @pointercancel="clearPointerStart"
          @click.prevent
          @keydown.enter.prevent="openLightbox(index)"
          @keydown.space.prevent="openLightbox(index)"
        >
          <img :src="withBaseUrl(image.src)" :alt="image.alt" loading="lazy" />
          <span class="vehicle-gallery__zoom-hint" aria-hidden="true">확대 보기</span>
        </button>
        <figcaption class="vehicle-gallery__caption">
          <span>{{ index + 1 }} / {{ orderedImages.length }}</span>
          <strong>{{ image.alt }}</strong>
        </figcaption>
      </figure>
    </div>

    <Teleport to="body">
      <div
        v-if="isLightboxOpen && lightboxImage"
        class="vehicle-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="차량 사진 확대 보기"
        @click.self="closeLightbox"
      >
        <div class="vehicle-lightbox__panel">
          <button class="vehicle-lightbox__close" type="button" aria-label="확대 사진 닫기" @click="closeLightbox">
            ×
          </button>

          <button
            class="vehicle-lightbox__nav vehicle-lightbox__nav--prev"
            type="button"
            :disabled="orderedImages.length <= 1"
            aria-label="이전 확대 사진 보기"
            @click="showPreviousLightbox"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <figure
            class="vehicle-lightbox__figure"
            :class="{ 'vehicle-lightbox__figure--zoomed': lightboxZoom > 1 }"
          >
            <div
              class="vehicle-lightbox__image-stage"
              role="group"
              aria-label="확대된 차량 사진. 확대 상태에서는 사진을 끌어서 볼 수 있습니다."
              @pointerdown="startLightboxPan"
              @pointermove="moveLightboxPan"
              @pointerup="endLightboxPan"
              @pointercancel="endLightboxPan"
              @wheel.prevent="handleLightboxWheel"
              @dblclick.prevent="toggleLightboxZoom"
            >
              <img
                class="vehicle-lightbox__image"
                :class="{ 'vehicle-lightbox__image--zoomed': lightboxZoom > 1 }"
                :src="withBaseUrl(lightboxImage.src)"
                :alt="lightboxImage.alt"
                :style="lightboxImageStyle"
                draggable="false"
              />
            </div>

            <figcaption class="vehicle-lightbox__caption">
              <div class="vehicle-lightbox__caption-text">
                <span>{{ lightboxIndex + 1 }} / {{ orderedImages.length }}</span>
                <strong>{{ lightboxImage.alt }}</strong>
              </div>
              <div class="vehicle-lightbox__zoom-controls" aria-label="사진 확대 조절">
                <button type="button" :disabled="lightboxZoom <= 1" @click="zoomOutLightboxImage">축소</button>
                <button type="button" @click="resetLightboxZoom">원본</button>
                <button type="button" :disabled="lightboxZoom >= maxLightboxZoom" @click="zoomInLightboxImage">확대</button>
              </div>
            </figcaption>
          </figure>

          <button
            class="vehicle-lightbox__nav vehicle-lightbox__nav--next"
            type="button"
            :disabled="orderedImages.length <= 1"
            aria-label="다음 확대 사진 보기"
            @click="showNextLightbox"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div v-if="orderedImages.length > 1" class="vehicle-lightbox__tabs" aria-label="확대 사진 선택">
            <button
              v-for="(image, index) in orderedImages"
              :key="image.id"
              class="vehicle-lightbox__tab"
              :class="{ 'vehicle-lightbox__tab--active': index === lightboxIndex }"
              type="button"
              :aria-label="`${index + 1}번 확대 사진 보기`"
              @click="lightboxIndex = index"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBaseUrl } from '@/data/fetchVehicleCatalog'
import type { VehicleImage } from '@/types/vehicle'

const props = defineProps<{
  images: VehicleImage[]
}>()

const activeIndex = ref(0)
const isLightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxZoom = ref(1)
const lightboxPan = ref({ x: 0, y: 0 })
const pointerStart = ref<{ x: number; y: number; time: number } | null>(null)
const navPointerStart = ref<{ x: number; y: number; time: number } | null>(null)
const lightboxPanStart = ref<{
  pointerId: number
  x: number
  y: number
  originX: number
  originY: number
} | null>(null)

const maxLightboxZoom = 3

const orderedImages = computed(() => {
  return [...props.images].sort((a, b) => a.sortOrder - b.sortOrder)
})

const activeImage = computed(() => orderedImages.value[activeIndex.value])
const lightboxImage = computed(() => orderedImages.value[lightboxIndex.value])
const lightboxImageStyle = computed(() => ({
  transform: `translate3d(${lightboxPan.value.x}px, ${lightboxPan.value.y}px, 0) scale(${lightboxZoom.value})`,
}))

const preloadGalleryImage = (index: number) => {
  const image = orderedImages.value[index]
  if (!image || typeof window === 'undefined') return

  const preloadImage = new window.Image()
  preloadImage.decoding = 'async'
  preloadImage.src = withBaseUrl(image.src)
}

watch([activeIndex, orderedImages], () => {
  const length = orderedImages.value.length
  if (length <= 1) return

  preloadGalleryImage((activeIndex.value + 1) % length)
  preloadGalleryImage((activeIndex.value - 1 + length) % length)
}, { immediate: true })

watch([lightboxIndex, orderedImages], () => {
  resetLightboxZoom()

  const length = orderedImages.value.length
  if (length <= 1) return

  preloadGalleryImage((lightboxIndex.value + 1) % length)
  preloadGalleryImage((lightboxIndex.value - 1 + length) % length)
}, { immediate: true })

watch(
  orderedImages,
  (images) => {
    if (activeIndex.value > images.length - 1) {
      activeIndex.value = 0
    }
    if (lightboxIndex.value > images.length - 1) {
      lightboxIndex.value = 0
    }
  },
  { immediate: true },
)

watch(isLightboxOpen, (isOpen) => {
  document.documentElement.classList.toggle('is-gallery-open', isOpen)
  if (!isOpen) {
    resetLightboxZoom()
  }
})

const clampZoom = (zoom: number) => {
  return Math.min(maxLightboxZoom, Math.max(1, Number(zoom.toFixed(2))))
}

const resetLightboxZoom = () => {
  lightboxZoom.value = 1
  lightboxPan.value = { x: 0, y: 0 }
  lightboxPanStart.value = null
}

const setLightboxZoom = (zoom: number) => {
  lightboxZoom.value = clampZoom(zoom)
  if (lightboxZoom.value <= 1) {
    lightboxPan.value = { x: 0, y: 0 }
    lightboxPanStart.value = null
  }
}

const zoomInLightboxImage = () => {
  setLightboxZoom(lightboxZoom.value + 0.5)
}

const zoomOutLightboxImage = () => {
  setLightboxZoom(lightboxZoom.value - 0.5)
}

const toggleLightboxZoom = () => {
  if (lightboxZoom.value > 1) {
    resetLightboxZoom()
    return
  }

  setLightboxZoom(2)
}

const handleLightboxWheel = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    zoomInLightboxImage()
    return
  }

  zoomOutLightboxImage()
}

const startLightboxPan = (event: PointerEvent) => {
  if (lightboxZoom.value <= 1) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture?.(event.pointerId)
  lightboxPanStart.value = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    originX: lightboxPan.value.x,
    originY: lightboxPan.value.y,
  }
}

const moveLightboxPan = (event: PointerEvent) => {
  const start = lightboxPanStart.value
  if (!start || start.pointerId !== event.pointerId || lightboxZoom.value <= 1) return

  event.preventDefault()
  lightboxPan.value = {
    x: start.originX + event.clientX - start.x,
    y: start.originY + event.clientY - start.y,
  }
}

const endLightboxPan = (event: PointerEvent) => {
  const start = lightboxPanStart.value
  if (start?.pointerId === event.pointerId) {
    const target = event.currentTarget as HTMLElement
    target.releasePointerCapture?.(event.pointerId)
    lightboxPanStart.value = null
  }
}

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

const openLightbox = (index: number) => {
  if (!orderedImages.value[index]) return
  lightboxIndex.value = index
  resetLightboxZoom()
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const showPreviousLightbox = () => {
  const length = orderedImages.value.length
  if (length <= 1) return
  lightboxIndex.value = (lightboxIndex.value - 1 + length) % length
}

const showNextLightbox = () => {
  const length = orderedImages.value.length
  if (length <= 1) return
  lightboxIndex.value = (lightboxIndex.value + 1) % length
}

const rememberPointerStart = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  pointerStart.value = {
    x: event.clientX,
    y: event.clientY,
    time: window.performance.now(),
  }
}

const clearPointerStart = () => {
  pointerStart.value = null
}

const rememberNavPointerStart = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  navPointerStart.value = {
    x: event.clientX,
    y: event.clientY,
    time: window.performance.now(),
  }
}

const clearNavPointerStart = () => {
  navPointerStart.value = null
}

const activateNavigationFromPointer = (event: PointerEvent, direction: 'previous' | 'next') => {
  const start = navPointerStart.value
  navPointerStart.value = null
  if (!start) return

  const movedX = Math.abs(event.clientX - start.x)
  const movedY = Math.abs(event.clientY - start.y)
  const elapsed = window.performance.now() - start.time

  const isClearTap = movedX < 12 && movedY < 12 && elapsed < 700
  if (!isClearTap) return

  if (direction === 'previous') {
    showPrevious()
    return
  }

  showNext()
}

const openLightboxFromPointer = (event: PointerEvent, index: number) => {
  const start = pointerStart.value
  pointerStart.value = null
  if (!start) return

  const movedX = Math.abs(event.clientX - start.x)
  const movedY = Math.abs(event.clientY - start.y)
  const elapsed = window.performance.now() - start.time

  const isClearTap = movedX < 8 && movedY < 8 && elapsed < 650
  if (!isClearTap) return

  openLightbox(index)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isLightboxOpen.value) return

  if (event.key === 'Escape') {
    closeLightbox()
  }
  if (event.key === 'ArrowLeft') {
    showPreviousLightbox()
  }
  if (event.key === 'ArrowRight') {
    showNextLightbox()
  }
  if (event.key === '+' || event.key === '=') {
    zoomInLightboxImage()
  }
  if (event.key === '-') {
    zoomOutLightboxImage()
  }
  if (event.key === '0') {
    resetLightboxZoom()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.documentElement.classList.remove('is-gallery-open')
})
</script>
