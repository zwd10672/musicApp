<template>
<m-header></m-header>
<Tab></Tab>
<router-view :style="viewStyle" v-slot="{Component}">
    <keep-alive>

     <component :is="Component" />
     </keep-alive>
</router-view>

<router-view
  :style="viewStyle"
  name="user"
  v-slot="{ Component }"
 >
  <transition name="slide">
    <keep-alive>

     <component :is="Component" />
     </keep-alive>
  </transition>
</router-view>
<player></player>

</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'
export default {
  components: {
    MHeader: Header,
    Tab,
    player: Player
  },
  computed: {
    viewStyle () {
      const bottom = this.playlist.length ? '45px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }

}
</script>
<style lang="scss">
</style>
