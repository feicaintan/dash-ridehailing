import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminDash from '../views/admin-dash.vue';
import AdminData from '../views/admin-data.vue';
import DaftarDriver from '../views/daftar-driver.vue';
import DriverReport from '../views/driver-report.vue';
import BlockedDrivers from '../views/blocked-drivers.vue';
import LoginForm from '../views/loginform.vue';
import GovDash from '../views/gov-dash.vue';
import Analysis from '../views/analysis.vue';
import management from '../views/management.vue';
import report from '../views/report.vue';
import trayek from '../views/daftar-trayek.vue';
import userlist from '../views/daftar-user.vue';
import LogActivity from '../views/LogActivity.vue';
import TarifRute from '../views/TarifRute.vue';
import AdminAnalysis from '../views/AdminAnalysis.vue';
import NewDriversGovVue from '@/views/NewDriversGov.vue';
import NewDriversAdminVue from '@/views/NewDriversAdmin.vue';
import ActiveUserVue from '@/views/ActiveUser.vue';
import ActiveDriver from '@/views/ActiveDriver.vue';
import driverGov from '@/views/driverGov.vue';
import userGov from '@/views/userGov.vue';
import trayekGov from '@/views/trayekGov.vue';
import tarifGov from '@/views/tarifGov.vue';
import driverReportGov from '@/views/driverReportGov.vue';
import tarifAdmin from '@/views/tarifAdmin.vue'
import blockedDriverGovVue from '@/views/blockedDriverGov.vue';
import LogActivityGovVue from '@/views/LogActivityGov.vue';
import ActiveDriverGovVue from '@/views/ActiveDriverGov.vue';
import ActiveUserGovVue from '@/views/ActiveUserGov.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin-dash',
    name: 'AdminDash',
    component: AdminDash,
  },
  {
    path: '/data',
    name: 'AdminData',
    component: AdminData,
  },
  {
    path: '/daftar-driver',
    name: 'DaftarDriver',
    component: DaftarDriver,
  },
  {
    path: '/driver-report',
    name: 'DriverReport',
    component: DriverReport,
  },
  {
    path: '/blocked-drivers',
    name: 'BlockedDrivers',
    component: BlockedDrivers,
  },
  {
    path: '/blockedDriverGov',
    name: 'BlockedDriverGov',
    component: blockedDriverGovVue,
  },
  {
    path: '/loginform',
    name: 'loginform',
    component: LoginForm,
  },
  {
    path: '/govdash',
    name: 'govdash',
    component: GovDash,
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: Analysis,
  },
  {
    path: '/management',
    name: 'management',
    component: management,
  },
  {
    path: '/report',
    name: 'report',
    component: report,
  },
  {
    path: '/daftar-trayek',
    name: 'trayek',
    component: trayek,
  },
  {
    path: '/daftar-user',
    name: 'userlist',
    component: userlist,
  },
  {
    path: '/LogActivity',
    name: 'LogActivity',
    component: LogActivity,
  },
  {
    path: '/LogActivityGov',
    name: 'LogActivityGov',
    component: LogActivityGovVue,
  },
  {
    path: '/TarifRute',
    name: 'TarifRute',
    component: TarifRute,
  },
  {
    path: '/AdminAnalysis',
    name: 'AdminAnalysis',
    component: AdminAnalysis,
  },
  {
    path: '/NewDriversGovVue',
    name: 'NewDriversGovVue',
    component: NewDriversGovVue,
  },
  {
    path: '/NewDriversAdminVue',
    name: 'NewDriversAdminVue',
    component: NewDriversAdminVue,
  },
  {
    path: '/ActiveUser',
    name: 'ActiveUser',
    component: ActiveUserVue,
  },
  {
    path: '/ActiveDriver',
    name: 'ActiveDriver',
    component: ActiveDriver,
  },
  {
    path: '/ActiveUserGov',
    name: 'ActiveUserGov',
    component: ActiveUserGovVue,
  },
  {
    path: '/ActiveDriverGov',
    name: 'ActiveDriverGov',
    component: ActiveDriverGovVue,
  },
  {
    path: '/driverGov',
    name: 'driverGov',
    component: driverGov,
  },
  {
    path: '/userGov',
    name: 'userGov',
    component: userGov,
  },
  {
    path: '/trayekGov',
    name: 'trayekGov',
    component: trayekGov,
  },
  {
    path: '/tarifGov',
    name: 'tarifGov',
    component: tarifGov,
  },
  {
    path: '/tarifAdmin',
    name: 'tarifAdmin',
    component: tarifAdmin,
  },
  {
    path: '/driverReportGov',
    name: 'driverReportGov',
    component: driverReportGov,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, 
});

export default router;