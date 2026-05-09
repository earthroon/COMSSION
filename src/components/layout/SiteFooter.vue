<template>
  <footer class="site-footer">
    <p>Powered by a Google Sheet to static catalog pipeline.</p>
    <nav aria-label="Footer navigation">
      <RouterLink v-for="item in navigation" :key="item.id" :to="item.href">
        {{ item.label }}
      </RouterLink>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { getNavigation } from '@/navigation/pageIndex'

const navigation = getNavigation('footer')
</script>
