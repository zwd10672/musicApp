<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      v-no-result="noResult"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer.js'
import { processSongs } from '@/service/song.js'
import MusicList from '@/components/music-list/music-list.vue'
import { SINGER_KEY } from '@/assets/js/constant.js'
import storage from 'good-storage'
export default {
  name: 'singet-detail',
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    noResult () {
      return !this.loading && !this.songs.length
    },
    computedData () {
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const cached = storage.session.get(SINGER_KEY)
        if (cached && cached.mid === this.$route.params.id) {
          ret = cached
        }
      }
      return ret
    },
    pic () {
      const singer = this.computedData
      return singer && singer.pic
    },
    title () {
      const singer = this.computedData
      return singer && singer.name
    }
  },
  props: {
    singer: Object
  },
  async created () {
    if (!this.computedData) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const res = await getSingerDetail(this.computedData)
    this.songs = await processSongs(res.songs)
    // this.songs = null
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail{
  position: fixed;
  z-index:10;
  top:0;
  left:0;
  bottom:0;
  right:0;
  background: $color-background
}
</style>
