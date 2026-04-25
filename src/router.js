import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import Home from '@/views/system/Home.vue'
import Profile from '@/views/patient/profile/Profile.vue'
import BookingView from '@/views/patient/booking/BookingView.vue'
import BookingHistoryView from '@/views/patient/booking/BookingHistoryView.vue'
import ExamRoom from './views/doctor/component/ExamRoom.vue'
import Schedule from './views/doctor/component/Schedule.vue'
import AccountSettings from './views/doctor/component/AccountSettings.vue'
import History from './views/doctor/component/History.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: false } 
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true, allowedRoles: ['Patient'] }
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingView,
    meta: { requiresAuth: true, allowedRoles: ['Patient'] }
  },
  {
    path: '/history',
    name: 'history',
    component: BookingHistoryView,
    meta: { requiresAuth: true, allowedRoles: ['Patient'] }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Admin'] },
    children: [
      {
        path: '', 
        name: 'admin-dashboard',
        component: () => import('@/views/admin/component/dashboard/Dashboard.vue') 
      },
      {
        path: 'doctors', 
        name: 'admin-doctors',
        component: () => import('@/views/admin/component/doctormanagement/ManageDoctors.vue') 
      },
      {
        path: 'receptionists', 
        name: 'admin-receptionists',
        component: () => import('@/views/admin/component/receptionistmanagement/ManageReceptionists.vue') 
      }
    ]
  },
  {
    path: '/doctor',
    component: () => import('@/views/doctor/DoctorLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Doctor'] },
    children: [
      {
        path: '', 
        name: 'examination',
        component: ExamRoom
      },
      {
        path: 'examination', 
        name: 'examination',
        component: ExamRoom
      },
      {
        path: 'schedule', 
        name: 'doctor-schedule',
        component: Schedule
      },
      {
        path: 'profile',
        name: 'doctor-profile',
        component: AccountSettings
      },
      {
        path: 'history',
        name: 'doctor-history',
        component: History
      }
    ] 
  },
  {
    path: '/receptionist',
    name: 'receptionist-dashboard',
    component: () => import('@/views/receptionist/ReceptionistDashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['Receptionist'] } 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  const isLoggedIn = authStore.isAuthenticated.value 

  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ name: 'home' })
  }

  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    const claims = authStore.getClaimsModel()
    const userRole = claims.role 

    if (to.meta.allowedRoles && (!userRole || !to.meta.allowedRoles.includes(userRole))) {
      console.warn(`Truy cập bị từ chối. Role hiện tại: ${userRole}`)
      return next({ name: 'home' }) 
    }
  }
  next()
})

export default router