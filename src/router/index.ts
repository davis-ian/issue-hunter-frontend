import { createRouter, createWebHistory } from 'vue-router'
import IssuesView from '../views/IssuesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/issues',
    },
    {
      path: '/issues',
      name: 'issues',
      component: IssuesView,
    },
    {
      path: '/searches',
      name: 'searches',
      component: () => import('../views/SearchesView.vue'),
    },
  ],
})

export default router
