<template>
  <footer class="site-footer">
    <p>카반하다는 상담부터 판매, 출고 후 관리까지 직접 책임지는 중고차 거래 채널입니다.</p>
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
