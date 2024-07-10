<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">

          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup (props, { emit }) {
    // 定义页面中需要的数据
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    // 定义一个变量用来判断是否需要继续加载loading
    const manualLoading = ref('true')
    // 计算什么时候显示loading
    const loading = computed(() => {
      // 没有获取到singer和songs的时候
      return !singer.value && !songs.value.length
    })
    // 计算没有数据的时候显示什么
    const noResult = computed(() => {
      // 没有搜索到歌曲和歌手信息的时候返回noResult
      return !singer.value && !songs.value.length && !hasMore.value
    })
    // 触发下拉loading的事件
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    // 定义一个计算属性，如果manualLoading和loading都为true时候则为true
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

    // 监听数据的变化
    watch(() => props.query, (newQuery) => {
      if (!newQuery) {
        return
      }
      // 如果query发生变化，则调用下面函数，拿到搜索数据
      searchFirst()
    })

    async function searchFirst () {
      if (!props.query) {
        return
      }
      // 初始化数据
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      // 接收接口传来的数据
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore () {
      // 如果hasMore.value为true时候才会继续执行下面函数
      if (!hasMore.value || !props.query) {
        return
      }
      // 每执行一次页数加一
      page.value++
      // 根据页数重新发起请求
      const result = await search(props.query, page.value, props.showSinger)
      // 不能直接拿到此次返回songs，应该与之前获取到的songs通过concat做一个拼接
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable () {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }
    function selectSong (song) {
      emit('select-song', song)
    }
    function selectSinger (singer) {
      emit('select-singer', singer)
    }
    return {
      singer,
      songs,
      loadingText,
      noResult,
      loading,
      noResultText,
      pullUpLoading,
      preventPullUpLoad,
      scroll,
      manualLoading,
      selectSong,
      selectSinger,
      // use-pull-up-load
      rootRef,
      isPullUpLoad
    }
  }
}
</script>

<style lang="scss" scoped>
  .suggest {
    height: 500px;
    width: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        width: 86%;
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
