<template>
  <main v-if="isLoading" class="empty-page">
    <p class="eyebrow">Loading</p>
    <h1>Loading vehicle</h1>
  </main>

  <main v-else-if="errorMessage" class="empty-page">
    <p class="eyebrow">Catalog error</p>
    <h1>Could not load vehicle catalog</h1>
    <p>{{ errorMessage }}</p>
    <RouterLink class="button-link" :to="{ name: 'vehicle-catalog' }">
      Back to catalog
    </RouterLink>
  </main>

  <main v-else-if="!vehicle" class="empty-page">
    <p class="eyebrow">Not found</p>
    <h1>Vehicle not found</h1>
    <p>No vehicle is registered for this URL.</p>
    <RouterLink class="button-link" :to="{ name: 'vehicle-catalog' }">
      Back to catalog
    </RouterLink>
  </main>

  <VehicleDetailView v-else :vehicle="vehicle" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import VehicleDetailView from '@/components/vehicles/VehicleDetailView.vue'
import { fetchVehicleCatalog } from '@/data/fetchVehicleCatalog'
import type { VehicleCatalog } from '@/types/vehicle'

const props = defineProps<{
  vehicleId: string
}>()

const catalog = ref<VehicleCatalog | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const vehicle = computed(() => {
  return catalog.value?.vehicles.find((item) => item.id === props.vehicleId) ?? null
})

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    catalog.value = await fetchVehicleCatalog()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error.'
  } finally {
    isLoading.value = false
  }
})
</script>
