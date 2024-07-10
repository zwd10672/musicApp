<template>
  <div class="player" v-show="playlist.length">
  <transition
   name="normal"
   @enter="enter"
   @afterEnter="afterEnter"
   @leave="leave"
   @afterLeave="afterLeave"
   >
    <div
        class="normal-player"
        v-show="fullScreen"
    >
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <!-- 头部区域渲染 -->
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 头部区域渲染结束 -->
        <!-- middle层 -->
        <div class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
        >
        <div class="middle-l" :style="middleLStyle">
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div
            ref="cdRef"
            class="cd">
              <img
              ref="cdImageRef"
              :src="currentSong.pic"
              :class="cdCls"
              class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric"> {{playingLyric}} </div>
          </div>
        </div>
          <scroll
            class="middle-r"
            ref="lyricScrollRef"
            :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum ===index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 播放器管理 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
              ref="proBarRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
              >
              </progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i  class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i  class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
        <!-- 播放器管理结束 -->
    </div>
    </transition>
    <mini-player
    :progress="progress"
    :toggle-play="togglePlay"
    :playingLyric="playingLyric"
    ></mini-player>
<!-- @pause 播放器自动暂停事件 -->
    <audio ref="audioRef"
    @pause="pause"
    @canplay="ready"
    @error="error"
    @timeupdate="updateTime"
    @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch, nextTick } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import MiniPlayer from './mini-player.vue'
import Scroll from '@/components/base/wrap-scroll/index.js'
import ProgressBar from './progress-bar.vue'
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'
import usePlayHistory from './use-play-history'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant.js'
export default {
  name: 'player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    const songReady = ref(false)
    const proBarRef = ref(null)
    const currentTime = ref(0)
    let progressChanging = false
    // 从state中通过计算属性拿到的动态数据
    const playing = computed(() => store.state.playing)
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const currentIndex = computed(() => store.state.currentIndex)
    const playlist = computed(() => store.state.playlist)
    const playMode = computed(() => store.state.playMode)
    // hook
    const { iconMode, changeMode } = useMode()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { currentLineNum, currentLyric, playLyric, pureMusicLyric, lyricScrollRef, lyricListRef, stopLyric, playingLyric } = useLyric({ songReady, currentTime })
    const { onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd, currentShow, middleLStyle, middleRStyle } = useMiddleInteractive()
    const { enter, afterEnter, leave, afterLeave, cdWrapperRef } = useAnimation()
    const { savePlay } = usePlayHistory()

    // 一大堆计算属性
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    // 获取到进度条的百分比
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // 点击按钮时候触发事件，动态添加一个disable属性
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    // 监听播放，当前歌曲发生变化的时候，调用DOM，完成播放
    watch(currentSong, (newSong) => {
      if (!newSong.id || !currentSong.value.url) {
        return
      }
      // 初始化时间
      currentTime.value = 0
      // 初始化歌曲准备
      songReady.value = false
      // 拿到DOM
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      // 实现播放
      audioEl.play()
      // 提交状态
      store.commit('setPlayingState', true)
    })

    // 监听播放状态的变化
    watch(playing, (newPlaying) => {
      const audioEl = audioRef.value
      if (!songReady.value) {
        return
      }
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        proBarRef.value.setOffset(progress.value)
      }
    })

    // 点击返回，将FullScreen设置为false 关闭全屏播放器
    function goBack () {
      store.commit('setFullScreen', false)
    }

    // 切换播放状态
    function togglePlay () {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    // 播放器暂停事件
    function pause () {
      store.commit('setPlayingState', false)
    }

    // 切换上一首歌
    function prev () {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      // 播放歌曲的下标减一
      let index = currentIndex.value - 1
      if (list.length === 1) {
        loop()
      } else {
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }

    // 切换下一首歌
    function next () {
      const list = playlist.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
      }
    }

    // 定义播放器循环播放
    function loop () {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 设置歌曲缓冲
    function ready () {
      if (songReady.value) {
        return
      }
      // 当歌曲准备状态为true时再执行播放
      songReady.value = true
      // 播放歌词
      playLyric()
      // 将当前播放歌曲保存到播放历史中
      savePlay(currentSong.value)
    }

    function error () {
      songReady.value = true
    }

    // 获取歌曲的当前播放时长
    function updateTime (e) {
      if (!progressChanging) { currentTime.value = e.target.currentTime }
    }

    // 进度条变化中
    function onProgressChanging (progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }

    // 进度条变化后
    function onProgressChanged (progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      // 点击进度条后，如果当前播放状态为false，则将播放状态改为true
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      // 然后执行歌词播放
      playLyric()
    }

    // 播放完当前歌曲之后执行的下一步操作
    function end () {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }
    return {
      fullScreen,
      currentSong,
      currentTime,
      audioRef,
      proBarRef,
      goBack,
      playIcon,
      progress,
      togglePlay,
      pause,
      prev,
      next,
      error,
      ready,
      end,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      disableCls,
      // util
      formatTime,
      // use-mode钩子函数
      iconMode,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      cdCls,
      cdRef,
      cdImageRef,
      // use-lyric
      currentLineNum,
      currentLyric,
      playLyric,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      pureMusicLyric,
      playingLyric,
      // use-middle-interactive
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle,
      playlist,
      // use-animation
      enter,
      afterEnter,
      cdWrapperRef,
      leave,
      afterLeave,
      // use-play-history
      savePlay
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          // display:none;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              margin-top: 5px;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
