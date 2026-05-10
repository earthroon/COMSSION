<template>
  <section class="vehicle-catalog" aria-labelledby="vehicle-catalog-title">
    <div class="vehicle-catalog__toolbar">
      <div>
        <p class="eyebrow">차량 보기</p>
        <h2 id="vehicle-catalog-title">등록 차량</h2>
      </div>

      <div class="vehicle-catalog__controls">
        <label class="field-label">
          <span>차량 검색</span>
          <input v-model.trim="searchQuery" type="search" placeholder="브랜드, 모델, 차종 검색" />
        </label>
        <label class="field-label">
          <span>판매 상태</span>
          <select v-model="statusFilter">
            <option value="all">전체</option>
            <option value="available">판매중</option>
            <option value="reserved">예약중</option>
            <option value="sold">판매완료</option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="isLoading" class="vehicle-catalog__state">차량 목록을 불러오는 중입니다...</div>
    <div v-else-if="errorMessage" class="vehicle-catalog__state vehicle-catalog__state--error">
      {{ errorMessage }}
    </div>
    <div v-else-if="visibleVehicles.length === 0" class="vehicle-catalog__state">
      등록된 차량이 없습니다.
    </div>

    <div v-else class="vehicle-grid">
      <VehicleCard v-for="vehicle in visibleVehicles" :key="vehicle.id" :vehicle="vehicle" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import VehicleCard from './VehicleCard.vue'
import { fetchVehicleCatalog } from '@/data/fetchVehicleCatalog'
import type { Vehicle, VehicleCatalog, VehicleStatus } from '@/types/vehicle'

const props = withDefaults(
  defineProps<{
    dataPath?: string
  }>(),
  {
    dataPath: 'data/vehicle-catalog.json',
  },
)

const catalog = ref<VehicleCatalog | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const searchQuery = ref('')
const statusFilter = ref<VehicleStatus | 'all'>('all')

const visibleVehicles = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return [...(catalog.value?.vehicles ?? [])]
    .filter((vehicle) => vehicle.status !== 'hidden')
    .filter((vehicle) => statusFilter.value === 'all' || vehicle.status === statusFilter.value)
    .filter((vehicle) => {
      if (!query) return true
      const haystack = [
        vehicle.title,
        vehicle.profile.brand,
        vehicle.profile.model,
        vehicle.profile.vehicleType,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
    .sort((a: Vehicle, b: Vehicle) => a.sortOrder - b.sortOrder)
})

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    catalog.value = await fetchVehicleCatalog(props.dataPath)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '차량 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>
