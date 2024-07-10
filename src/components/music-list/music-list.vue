<template>
  <div class="music-list">
    <div class="back"
    @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
     class="bg-image"
     :style="bgImageStyle"
     ref="bgImageRef"
     >
     <!-- 随机播放按钮样式层 -->
     <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 图片滤镜层 -->
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <!-- 歌曲列表层 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <!-- 渲染每一首歌曲，将songs传入进去 -->
        <song-list
          :songs="songs"
          @select="selectItem"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/base/wrap-scroll/index.js'
import { mapActions, mapState } from 'vuex'

const RESERVE_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    rank: Boolean
  },
  data () {
    return {
      imageHeight: 0,
      // 定义滚动的纵轴的坐标
      scrollY: 0,
      // 最大滚动距离
      maxTranslateY: 0
    }
  },
  computed: {
    playBtnStyle () {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return { display }
    },
    bgImageStyle () {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let transformZ = 0
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        transformZ = 1
        height = `${RESERVE_HEIGHT}px`
      }
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        backgroundImage: `url("${this.pic}")`,
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})translateZ(${transformZ}px)`
      }
    },

    scrollStyle () {
      const bottom = this.playlist.length ? '40px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    ...mapState([
      'playlist'
    ]),
    filterStyle () {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imageHeight,
          scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImageRef.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVE_HEIGHT
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    // 点击播放歌曲，用list将当前歌曲保存到vuex中，index表示当前歌曲的索引
    selectItem ({ song, index }) {
      console.log(this.songs)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    // 歌曲随机播放
    random () {
      this.randomPlay(this.songs)
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      z-index:20;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      z-index: 0;
      width: 100%;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
        // background: red;
      }
    }
  }
</style>
