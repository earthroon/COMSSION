<template>
  <main class="home-page">
    <section class="home-hero">
      <p class="eyebrow">Sheet powered catalog</p>
      <h1>Vehicle catalog page template</h1>
      <p>
        A lightweight commission-ready page for listing vehicles from a validated
        public JSON catalog generated from a private Google Sheet.
      </p>
      <RouterLink class="button-link" :to="{ name: 'vehicle-catalog' }">
        View catalog
      </RouterLink>
    </section>
  </main>
</template>
