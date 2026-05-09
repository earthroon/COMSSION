<template>
  <header class="site-header">
    <RouterLink class="site-header__brand" to="/" aria-label="Go home">
      <span class="site-header__mark">VC</span>
      <span>Vehicle Catalog</span>
    </RouterLink>

    <nav class="site-header__nav" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navigation"
        :key="item.id"
        :to="item.href"
        class="site-header__link"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { getNavigation } from '@/navigation/pageIndex'

const navigation = getNavigation('header')
</script>
