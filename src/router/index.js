import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HistoryView from '@/views/HistoryView.vue'
import OperarView from '@/views/OperarView.vue'
import EditTransactionView from '@/views/EditTransactionView.vue'
import AnalysisView from '@/views/AnalysisView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: "/login", 
    component: LoginView 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',    
    component: DashboardView
  },
  { 
    path: '/history', 
    name: 'History', 
    component: HistoryView
  },
  {
    path: '/operar',
    name: 'Operar',
    component: OperarView
  },
  {
    path: '/edit/:id',
    name: 'EditTransaction',
    component: EditTransactionView
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: AnalysisView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
