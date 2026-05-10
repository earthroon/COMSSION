<template>
  <main class="vehicle-detail">
    <RouterLink class="vehicle-detail__back" :to="{ name: 'vehicle-catalog' }">
      차량 목록으로 돌아가기
    </RouterLink>

    <section class="vehicle-detail__hero">
      <p class="eyebrow">차량 상세 정보</p>
      <h1>{{ vehicle.title }}</h1>
      <p>
        {{ vehicle.profile.vehicleType }} · {{ vehicle.profile.year }}년식 ·
        {{ vehicle.profile.mileageKm.toLocaleString() }}km
      </p>
    </section>

    <VehicleYoutubeEmbed
      v-if="vehicle.video"
      :youtube-id="vehicle.video.youtubeId"
      :title="vehicle.video.title"
    />

    <VehicleGallery :images="vehicle.images" />
    <VehicleProfileColumns :vehicle="vehicle" />

    <section class="vehicle-detail__description">
      <h2>상세 설명</h2>
      <p>{{ vehicle.profile.detailDescription }}</p>
    </section>

    <section v-if="vehicle.contact" class="vehicle-detail__cta">
      <div>
        <p class="eyebrow">상담 문의</p>
        <h2>{{ vehicle.contact.label }}</h2>
        <p>{{ vehicle.contact.phoneDisplay }}</p>
      </div>
      <VehiclePhoneCopyButton :contact="vehicle.contact" />
    </section>
  </main>
</template>

<script setup lang="ts">
import VehicleGallery from './VehicleGallery.vue'
import VehiclePhoneCopyButton from './VehiclePhoneCopyButton.vue'
import VehicleProfileColumns from './VehicleProfileColumns.vue'
import VehicleYoutubeEmbed from './VehicleYoutubeEmbed.vue'
import type { Vehicle } from '@/types/vehicle'

defineProps<{
  vehicle: Vehicle
}>()
</script>
