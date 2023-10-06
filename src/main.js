import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
// 导入vant组件
import '@/util/vant-ui'
// 引入全局样式文件

import { Button, SwipeItem } from 'vant'
import '@/assets/scss/index.scss'
const app = createApp()
app.use(Button)
app.use(SwipeItem)
createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).mount('#app')
