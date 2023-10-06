<template>
<div v-loading="!singers.length" class="singer">
<indexList
:data="singers"></indexList>
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
    console.log(res)
    this.singers = res.singers
  }
}
</script>

<style lange="scss" scoped>
  .singer {
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
