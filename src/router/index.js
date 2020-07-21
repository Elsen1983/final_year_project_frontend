import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Detail from '../views/Detail.vue'
import NotFound from '../views/Error_NotFound.vue'
import Unauthorized from '../views/Error_Unauthorized.vue'
import Role from './models/role'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'register',
        component: Register
    },
    {
        path: '/',
        name: 'profile',
        component: Profile
    },
    //Only admin can see it.
    {
        path: '/admin',
        name: 'admin',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/Admin.vue'),
        meta: { roles: [Role.ADMIN] }
    },
    {
        //use router with parameter
        path: '/',
        name: 'detail',
        component: Detail
    },
    {
        path: '/404',
        component: NotFound
    },
    {
        path: '/401',
        component: Unauthorized
    },
    {
        path: '*', redirect: '/404'
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
