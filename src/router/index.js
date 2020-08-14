import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Detail from '../views/Detail.vue'
import NotFound from '../views/Error_NotFound.vue'
import Unauthorized from '../views/Error_Unauthorized.vue'
import Role from '../models/role'
import UserService from '../services/user.service'
import UserData from "../views/UserData";
import AdminUsersList from "../views/AdminUsersList";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        //public pages
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        //User and admin page
        {
            path: '/profile',
            component: Profile,
            meta: { roles: [Role.ADMIN, Role.USER] }
        },
        {
            path: '/userdata',
            component: UserData,
            meta: { roles: [Role.ADMIN, Role.USER] }
        },
        {
            path: '/basicdata/{username}',
            component: UserData,
            meta: { roles: [Role.ADMIN, Role.USER] }
        },
        //Only admin can see it.
        {
            path: '/admindashboard',
            name: 'admindashboard',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AdminDashboard.vue'),
            meta: { roles: [Role.ADMIN] }
        },
        {
            path: '/detail/:id',
            name: 'detail',
            component: Detail,
            meta: { roles: [Role.ADMIN] }
        },
        {
            path: '/userslist',
            name: 'userslist',
            component: AdminUsersList,
            meta: { roles: [Role.ADMIN] }
        },
        //error pages are public
        {
            path: '/404',
            component: NotFound
        },
        {
            path: '/401',
            component: Unauthorized
        },
        //Otherwise redirect to not found page.
        {
            path: '*', redirect: '/404'
        }
    ]
});

router.beforeEach((to, from, next) => {
    const { roles } = to.meta;
    const currentUser = UserService.currentUserValue;

    if (roles) {
        if (!currentUser) {
            return next({ path: '/login' });
        }

        if (roles.length && !roles.includes(currentUser.role)) {
            return next({ path: '/401' });
        }
    }
    next();
});
export default router;