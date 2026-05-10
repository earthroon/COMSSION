<template>
  <main class="home-page home-page--kabanhada">
    <section class="home-hero home-hero--brand">
      <div class="home-hero__logo-wrap">
        <img class="home-hero__logo" :src="logoSrc" alt="카반하다 로고" />
      </div>

      <div class="home-hero__copy">
        <p class="eyebrow">KABANHADA VEHICLE CATALOG</p>
        <h1>중고차는 차보다,<br />누구에게 사느냐가 더 중요합니다.</h1>
        <p class="home-hero__description">
          카반하다는 상담부터 판매, 출고 후 관리까지 직접 책임지는 중고차 거래 채널입니다.
          처음 전화부터 차량 안내, 탁송, 구매 후 문제 대응까지 중간 단계 없이 끝까지 챙깁니다.
        </p>
        <div class="home-hero__actions" aria-label="카반하다 주요 이동">
          <RouterLink class="button-link" :to="{ name: 'vehicle-catalog' }">
            차량 카탈로그 보기
          </RouterLink>
          <RouterLink class="button-link button-link--ghost" :to="{ name: 'vehicle-catalog' }">
            상담 문의하기
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="home-promises" aria-labelledby="kabanhada-promises-title">
      <div class="home-section-heading">
        <p class="eyebrow">KABANHADA PROMISE</p>
        <h2 id="kabanhada-promises-title">카반하다의 약속</h2>
      </div>

      <div class="home-promise-grid">
        <article v-for="promise in promises" :key="promise.title" class="home-promise-card">
          <h3>{{ promise.title }}</h3>
          <p>{{ promise.body }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const logoSrc = `${import.meta.env.BASE_URL}brand/logo.svg`

const promises = [
  {
    title: '직접 상담',
    body: '처음 전화부터 차량 안내까지 직접 응대합니다.',
  },
  {
    title: '전국 탁송',
    body: '지역과 거리에 상관없이 탁송 거래를 안내합니다.',
  },
  {
    title: '사후관리',
    body: '구매 후 문제가 생겨도 모른 척하지 않고 끝까지 돕습니다.',
  },
]
</script>
