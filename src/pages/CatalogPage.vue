<template>
  <main class="catalog-page">
    <section class="catalog-page__hero">
      <p class="eyebrow">카반하다 차량 카탈로그</p>
      <h1>차량 목록</h1>
      <p>
        등록된 차량을 카드로 먼저 확인하고, 상세 페이지에서 소개 영상과 사진,
        차량 정보, 상담 전화번호를 확인할 수 있습니다.
      </p>
    </section>

    <VehicleCatalogGrid data-path="data/vehicle-catalog.json" />
  </main>
</template>

<script setup lang="ts">
import VehicleCatalogGrid from '@/components/vehicles/VehicleCatalogGrid.vue'
</script>
