import { createRouter, createWebHistory } from 'vue-router';
import LoginPanel from '../views/LoginPanel.vue';
import AdminDashboard from "../views/AdminDashboard.vue";
import UserPanel from "../views/UserPanel.vue";
import RolePanel from "@/views/RolePanel.vue";
import PermissionList from "@/views/PermissionList.vue";
import SettingPanel from "@/views/SettingPanel.vue";

const routes = [
    {
        path: '/',
        redirect: '/login', // Redirect to login page if logged out
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPanel,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/users',
        name: 'Users',
        component: UserPanel,
        meta: { requiresAuth: true },
    },
    {
        path: '/roles',
        name: 'Roles',
        component: RolePanel,
        meta: { requiresAuth: true },
    },
    {
        path: '/permissions',
        name: 'Permissions',
        component: PermissionList,
        meta: { requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingPanel,
        meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (token) {
        // If the user is logged in and tries to visit the login page, redirect to dashboard
        if (to.name === 'Login') {
            next({ name: 'Dashboard' });
        } else {
            next();
        }
    } else {
        // If the user is not logged in, redirect to login page for protected routes
        if (to.matched.some(record => record.meta.requiresAuth)) {
            next({ name: 'Login' });
        } else {
            next();
        }
    }
});

export default router;