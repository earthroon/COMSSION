<template>
  <main class="catalog-page">
    <section class="catalog-page__hero">
      <p class="eyebrow">Vehicle Catalog</p>
      <h1>Catalog</h1>
      <p>
        Browse cards first, then open a vehicle detail page with video, gallery,
        profile columns, and contact copy action.
      </p>
    </section>

    <VehicleCatalogGrid data-path="data/vehicle-catalog.json" />
  </main>
</template>

<script setup lang="ts">
import VehicleCatalogGrid from '@/components/vehicles/VehicleCatalogGrid.vue'
</script>
