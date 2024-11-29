import { createRouter, createWebHashHistory } from "vue-router";
/**Views */
const Dashboard = () => import("@/views/Dashboard.vue");
const Projects = () => import("@/views/Projects.vue");
const Tasks = () => import("@/views/Tasks.vue");
const Profile = () => import("@/views/Profile.vue");
const UserManagement = () => import("@/views/UserManagement.vue");
const Login = () => import("@/views/Login.vue");
const GanttChart = () => import("@/views/GanttChart.vue");
const GanttChart2 = () => import("@/views/GanttChart2.vue");
/**Views Children */
/**Projects */
const TaskManagement = () => import("@/views/projects/Task.vue");
const TeamMember = () => import("@/views/projects/TeamMember.vue");
const Swimlane = () => import("@/views/projects/Swimlane.vue");
const Upload = () => import("@/views/projects/Upload.vue");

const GameRoom = () => import("@/views/GameRoom.vue");
/**Components */
const Layout = () => import("@/components/alpha/Layout.vue");

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "gantt-chart",
        name: "GanttChart",
        component: GanttChart,
      },
      {
        path: "gantt-chart-2",
        name: "GanttChart2",
        component: GanttChart2,
      },
      {
        path: "projects",
        name: "Projects",
        component: Projects,
        children: [
          {
            path: "task-management",
            name: "TaskManagement",
            component: TaskManagement,
          },
          {
            path: "task-management/:id?",
            name: "TaskManagement",
            component: TaskManagement,
          },
          {
            path: "team-member",
            name: "TeamMember",
            component: TeamMember,
          },
          {
            path: "swimlane",
            name: "Swimlane",
            component: Swimlane,
          },
          {
            path: "upload",
            name: "Upload",
            component: Upload,
          },
        ],
      },
      {
        path: "tasks",
        name: "Tasks",
        component: Tasks,
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
      {
        path: "user-management",
        name: "UserManagement",
        component: UserManagement,
      },
      {
        path: "gameroom",
        name: "GameRoom",
        component: GameRoom,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;
