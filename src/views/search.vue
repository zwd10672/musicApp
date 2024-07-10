<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
    <div>
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
          class="item"
          v-for="item in hotKeys"
          :key="item.id"
          @click="addQuery(item.key)"
          >
          <span>{{item.key}}</span>
          </li>
        </ul>
      </div>
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <confirm
        ref="confirmRef"
        text="是否清空搜索历史"
        confirm-btn-text="清空"
        @confirm="clearSearch"
        ></confirm>

        <search-list @delete="deleted" @select="addQuery" :searches="searchHistory"></search-list>
      </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest @select-song="selectSong" @select-singer="selectSinger" :query="query"></suggest>
    </div>
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
import { ref, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant.js'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/search-suggest'
import SearchList from '@/components/search/search-list'
import Scroll from '@/components/base/wrap-scroll/index.js'
import Confirm from '@/components/base/confirm/confirm'
import { getHotKeys } from '@/service/search.js'
import useSearchHistory from '@/components/search/use-search-history.js'
export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  setup () {
    const query = ref('')
    const hotKeys = ref([])
    const store = useStore()
    const router = useRouter()
    const selectedSinger = ref('')
    const scrollRef = ref(null)
    const confirmRef = ref(null)
    const { saveSearch, deleted, clearSearch } = useSearchHistory()
    const searchHistory = computed(() => store.state.searchHistory)
    // 发送请求，获取到热搜内容
    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })
    // 监听query的变化，如果变的话，就重新渲染scoll
    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    // 重新刷新scroll组件
    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }
    function addQuery (s) {
      query.value = s
    }

    // 选择歌曲
    function selectSong (song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }

    // 选择歌手
    function selectSinger (singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      // 从本地读取歌曲
      cached(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }
    function cached (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
    // showConfirm展示
    function showConfirm () {
      confirmRef.value.show()
    }
    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      scrollRef,
      confirmRef,
      showConfirm,
      // use-search-history
      clearSearch,
      saveSearch,
      deleted
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
