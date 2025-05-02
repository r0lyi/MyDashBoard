import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/DemografiaCliente',
  },
  {
    path: '/DemografiaCliente',
    component: () => import ('../views/DemografiaCliente.vue')
  },
  
  {
    path: '/AnalisisProducto',
    component: () => import ('../views/AnalisisProducto.vue')
  },
  {
    path: '/MetricaDeportiva',
    component: () => import ('../views/MetricaDeportiva.vue')
  }
  ,
  {
    path: '/AnalisisEvento',
    component: () => import ('../views/AnalisisEvento.vue')
  }
  ,
  {
    path: '/kpis',
    component: () => import ('../views/KpiPage.vue')
  }
  
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
export default router
