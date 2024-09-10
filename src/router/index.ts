import { createRouter, createWebHistory } from 'vue-router';
/**Views */
const Dashboard = () => import('@/views/Dashboard.vue');
const Projects = () => import('@/views/Projects.vue');
const Tasks = () => import('@/views/Tasks.vue');
const Profile = () => import('@/views/Profile.vue');
const Login = () => import('@/views/Login.vue');
/**Views Children */
/**Projects */
const TeamMember = () => import('@/views/projects/TeamMember.vue');
const Swimlane = () => import('@/views/projects/Swimlane.vue');
const Upload = () => import('@/views/projects/Upload.vue');

/**Components */
const Layout = () => import('@/components/alpha/Layout.vue');

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'projects',
        name: 'Projects',
        component: Projects,
        children: [
          {
            path: 'team-member',
            name: 'TeamMember',
            component: TeamMember
          },
          {
            path: 'swimlane',
            name: 'Swimlane',
            component: Swimlane
          },
          {
            path: 'upload',
            name: 'Upload',
            component: Upload
          },
        ]
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: Tasks
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
