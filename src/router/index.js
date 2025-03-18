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
        meta: { requiresAuth: true },  // This page requires authentication
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation Guard to check authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if the route requires authentication and if no token exists
        if (!token) {
            // Redirect to login page if the user is not logged in
            next({ name: 'Login' });
        } else {
            // Allow access to the route if authenticated
            next();
        }
    } else {
        // Allow access to all other routes
        next();
    }
});

export default router;