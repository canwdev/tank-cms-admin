import Vue from 'vue'
import Router from 'vue-router'
import {frontendBaseUrl} from '@/settings'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'wllpaper' }
    }]
  },

  {
    path: '/settings/',
    component: Layout,
    children: [{
      path: '',
      name: 'settings',
      component: () => import('@/views/tools/settings'),
      meta: { title: '网站设置', icon: 'web' }
    }]
  },

  {
    path: '/post',
    component: Layout,
    redirect: '/post/list',
    meta: {
      title: '文章',
      icon: 'doc'
    },
    children: [
      {
        path: 'list',
        name: 'postList',
        component: () => import('@/views/post/list'),
        meta: { title: '文章列表', icon: 'list2' }
      },
      {
        path: 'edit',
        name: 'postEdit',
        component: () => import('@/views/post/edit'),
        meta: { title: '编辑创建', icon: 'create' }
      },
      {
        hidden: true,
        path: 'detail',
        name: 'postDetail',
        component: () => import('@/views/post/detail'),
        meta: { title: '查看', icon: 'eye-open' }
      }
    ]
  },

  {
    path: '/wt',
    component: Layout,
    redirect: '/wt/techtree',
    meta: {
      title: '科技树',
      icon: 'tree'
    },
    children: [
      {
        path: 'techtree',
        name: 'techTree',
        component: () => import('@/views/warthunder/techtree'),
        meta: { title: '列表', icon: 'list2' }
      },
      {
        path: 'edit',
        name: 'techTreeEdit',
        component: () => import('@/views/warthunder/edit'),
        meta: { title: '编辑', icon: 'create' }
      }
    ]
  },

  {
    path: '/recruit/',
    component: Layout,
    children: [{
      path: '',
      name: 'recruit',
      component: () => import('@/views/tools/recruit'),
      meta: { title: '招聘管理', icon: 'people-hello' }
    }]
  },

  {
    path: '/tools/file-upload',
    component: Layout,
    children: [{
      path: '',
      name: 'FileUpload',
      component: () => import('@/views/tools/file-upload'),
      meta: { title: '文件上传', icon: 'upload' }
    }]
  },

  {
    path: '/tools/',
    component: Layout,
    children: [{
      path: '',
      name: 'tools',
      component: () => import('@/views/tools/tools'),
      meta: { title: '实用工具', icon: 'widgets' }
    }]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: frontendBaseUrl,
        meta: { title: '前端页面', icon: 'outbound' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
