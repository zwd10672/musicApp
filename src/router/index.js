import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend.vue'/* webpackChunkName:"recommend" */)
const Singer = () => import('@/views/singer.vue'/* webpackChunkName:"singer" */)
const TopList = () => import('@/views/top-list.vue'/* webpackChunkName:"top-list" */)
const Search = () => import('@/views/search.vue'/* webpackChunkName:"search" */)
const Album = () => import('@/views/album.vue'/* webpackChunkName:"album" */)
const TopDeatil = () => import('@/views/top-detail.vue'/* webpackChunkName:"top-detail" */)
const SingerDetail = () => import('@/views/singer-detail.vue'/* webpackChunkName:"singer-detail" */)
const UserCenter = () => import('@/views/user-center.vue'/* webpackChunkName:"user-center" */)
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id', component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      { path: ':id', component: SingerDetail }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      { path: ':id', component: SingerDetail }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      { path: ':id', component: TopDeatil }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
