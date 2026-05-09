<template>
  <RouterLink class="vehicle-card" :to="{ name: 'vehicle-detail', params: { vehicleId: vehicle.id } }">
    <div class="vehicle-card__media">
      <img :src="withBaseUrl(vehicle.thumbnail)" :alt="`${vehicle.title} thumbnail`" loading="lazy" />
      <span class="vehicle-status" :data-status="vehicle.status">{{ statusLabel }}</span>
    </div>

    <div class="vehicle-card__body">
      <h3>{{ vehicle.title }}</h3>
      <p class="vehicle-card__meta">
        {{ vehicle.profile.vehicleType }} · {{ vehicle.profile.year }} ·
        {{ vehicle.profile.mileageKm.toLocaleString() }}km
      </p>
      <p>{{ vehicle.profile.shortDescription }}</p>
    </div>

    <div class="vehicle-card__footer">
      <span>View detail</span>
      <VehiclePhoneCopyButton v-if="vehicle.contact" :contact="vehicle.contact" compact />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VehiclePhoneCopyButton from './VehiclePhoneCopyButton.vue'
import { withBaseUrl } from '@/data/fetchVehicleCatalog'
import type { Vehicle } from '@/types/vehicle'

const props = defineProps<{
  vehicle: Vehicle
}>()

const statusLabel = computed(() => {
  const labels: Record<Vehicle['status'], string> = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
    hidden: 'Hidden',
  }
  return labels[props.vehicle.status]
})
</script>
