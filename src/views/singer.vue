<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
    ></index-list>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import indexlist from '@/components/base/index-list/index-list'
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
