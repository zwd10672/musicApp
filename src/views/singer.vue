<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <router-view v-slot="{ Component }">
       <transition name="slide">
         <!-- slide为样式名 -->
         <!-- 路由组件实现跳转 -->
          <component :data="selectedSinger" :is="Component" />
       </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import indexlist from '@/components/base/index-list/index-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant.js'
export default {
  name: 'mySinger',
  components: {
    indexList: indexlist
  },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created () {
    const res = await getSingerList()
    this.singers = res.singers
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      // 从本地读取歌曲
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger (singer) {
      // 将当前歌曲保存的本地
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lange="scss" scoped>
  .singer {
    width: 100%;
    top: 88px;
    bottom: 0;
    position: fixed;
  }
</style>
