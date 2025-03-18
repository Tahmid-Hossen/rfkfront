import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Import from views folder
import Dashboard from '../views//Dashboard.vue'; // Import from views folder

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;