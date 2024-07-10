import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {

      MusicList
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    props: {
      data: Object
    },
    computed: {
      noResult() {
        return !this.loading && !this.data.length
      },
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },

    async created() {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const res = await fetch(data)
      this.songs = await processSongs(res.songs)
      // this.songs = null
      this.loading = false
    }
  }
}
