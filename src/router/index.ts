import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/catalog',
      name: 'vehicle-catalog',
      component: () => import('@/pages/CatalogPage.vue'),
    },
    {
      path: '/catalog/:vehicleId',
      name: 'vehicle-detail',
      component: () => import('@/pages/VehicleDetailPage.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
