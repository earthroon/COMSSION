<template>
  <section class="vehicle-profile-columns" aria-labelledby="vehicle-profile-title">
    <h2 id="vehicle-profile-title">Profile</h2>
    <dl>
      <div v-for="row in rows" :key="row.label" class="vehicle-profile-item">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '@/types/vehicle'

const props = defineProps<{
  vehicle: Vehicle
}>()

const rows = computed(() => {
  const profile = props.vehicle.profile
  return [
    { label: 'Vehicle type', value: profile.vehicleType },
    { label: 'Brand', value: profile.brand },
    { label: 'Model', value: profile.model },
    { label: 'Year', value: `${profile.year}` },
    { label: 'Mileage', value: `${profile.mileageKm.toLocaleString()}km` },
    { label: 'Fuel', value: profile.fuel },
    { label: 'Transmission', value: profile.transmission },
    { label: 'Color', value: profile.color },
    { label: 'Status', value: props.vehicle.status },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
})
</script>
