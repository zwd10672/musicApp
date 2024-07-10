import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import lazyPlugin from 'vue3-lazy';
import loadingDirective from '@/components/base/loading/directive';
import noResultDirective from '@/components/base/no-result/directive';

// 引入全局样式文件

import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant';
import { processSongs } from '@/service/song';
import { load, saveAll } from '@/assets/js/array-store';

import '@/assets/scss/index.scss';

const favoriteList = load(FAVORITE_KEY);
if (favoriteList.length > 0) {
  processSongs(favoriteList).then((songs) => {
    store.commit('setFavoriteList', songs);
    saveAll(songs, FAVORITE_KEY);
  });
}
const playSongs = load(PLAY_KEY);
if (playSongs.length > 0) {
  processSongs(playSongs).then((songs) => {
    store.commit('setPlayHistory', songs);
    saveAll(songs, PLAY_KEY);
  });
}

console.log(process.env);
console.log(process.env.PORT);
console.log(process.env.NODE_ENV);

createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app');
