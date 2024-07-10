<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="iconMode"
                @click="changeMode"
              >
              </i>
              <span class="text">{{modeText}}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll
            ref="scrollRef"
            class="list-content"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
            <!-- <ul ref="listRef"> -->
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i
                  class="current"
                  :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                class="delete"
                @click.stop="removeSong(song)"
                :class="{'disable':removing}"
                 >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
        ref="confirmRef"
        text="是否清空播放列表"
        confirm-btn-text="清空"
        @confirm="clearSongList"
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/wrap-scroll/index.js'
import confirm from '@/components/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song.vue'
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'playlist',
  components: {
    Scroll,
    confirm,
    AddSong
  },
  setup () {
    const store = useStore()
    const visible = ref(false)
    const removing = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)
    const { changeMode, modeText, iconMode } = useMode()
    const { getFavoriteIcon, toggleFavorite, isFavorite } = useFavorite()

    // 监听当前歌曲的变化
    watch(currentSong, async (newSong) => {
      // 加一层保护，如果没有拿到当前歌曲id的时候就退出程序
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // 拿到喜欢的歌曲
    function getCurrentIcon (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    // 显示
    async function show () {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }

    // 隐藏
    function hide () {
      visible.value = false
    }

    // 重新渲染scroll
    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }

    // 定位到当前播放歌曲
    function scrollToCurrent () {
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id
      })
      if (index === -1) {
        return
      }
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    // 点击列表中的歌曲触发播放功能
    function selectItem (song) {
      const index = playlist.value.findIndex((item) => {
        return song.id === item.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    // 从列表中移除歌曲
    function removeSong (song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      // 加一层保护，如果播放列表为空的时候隐藏列表
      if (!playlist.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    // 点击展示组件confirm
    function showConfirm () {
      confirmRef.value.show()
    }

    // 清空歌曲列表
    function clearSongList () {
      store.dispatch('clearSongList')
      hide()
    }

    // 添加歌曲页面展示showAddSong
    function showAddSong () {
      addSongRef.value.show()
    }

    return {
      visible,
      playlist,
      sequenceList,
      scrollRef,
      listRef,
      confirmRef,
      addSongRef,
      show,
      hide,
      getCurrentIcon,
      selectItem,
      removeSong,
      removing,
      showConfirm,
      clearSongList,
      showAddSong,
      // use-mode
      changeMode,
      iconMode,
      modeText,
      // use-favorite
      getFavoriteIcon,
      toggleFavorite,
      isFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
