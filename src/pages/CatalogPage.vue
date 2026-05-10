<template>
  <main class="catalog-page catalog-page--front">
    <section class="catalog-page__hero catalog-page__hero--front">
      <p class="eyebrow">카반하다 차량 카탈로그</p>
      <h1>현재 판매중인 차량</h1>
      <p>
        지금 상담 가능한 차량만 간단한 카드로 모았습니다.
        원하는 차량 카드를 누르면 영상, 사진, 상세 정보, 상담 연락처를 바로 확인할 수 있습니다.
      </p>
    </section>

    <VehicleCatalogGrid
      data-path="data/vehicle-catalog.json"
      available-only
      simplified
    />
  </main>
</template>

<script setup lang="ts">
import VehicleCatalogGrid from '@/components/vehicles/VehicleCatalogGrid.vue'
</script>
