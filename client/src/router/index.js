import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Navbar from '../components/Navbar.vue'
import Employee from '../views/Employee.vue'

const routes = [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      
      component: Navbar, 
      children: [
        {
          path: '',
          name: 'index',
          component: Index
        },
        {
          path: 'employee',
          component: Employee
        },
      ],
    },
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  
  export default router
  