<template>
  <Scroll
    class="index-list"
    :probe-type="3"
    @scroll="onScroll"
    ref="scrollRef"
  >
    <ul ref="groupRef">
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
      >
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="onItemClick(item)"
          >
            <img class="avatar" v-lazy="item.pic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed"
    v-show="fixedTitle"
    :style="fixedStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
        <div
      class="shortcut"
      @touchstart.stop.prevent="onshortcutTouchStart"
      @touchmove.stop.prevent="onshortcutTouchMove"
      @touchend.stop.prevent
    >
    <!-- .stop.prevent 阻止事件冒泡行为 -->
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          class="item"
          :data-index="index"
          :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
  </Scroll>
</template>
<script>
import Scroll from '@/components/base/wrap-scroll/index.js'
import useFixed from '@/components/base/index-list/use-fixed.js'
import useshortcut from '@/components/base/index-list/use-shortcut.js'
export default {
  name: 'index-list',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  // 通过emits定义一个select事件
  emits: ['select'],
  setup (props, { emit }) {
    // 从useFixed中拿到onScroll函数 将group传递给useFixed函数体
    const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
    const { shortcutList, scrollRef, onshortcutTouchStart, onshortcutTouchMove } = useshortcut(props, groupRef)
    // 通过onItemClick将emit事件派发出去
    function onItemClick (item) {
      emit('select', item)
    }
    return {
      // useFixed钩子函数中的数据
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      // useshortcut钩子函数中的数据
      onshortcutTouchStart,
      shortcutList,
      scrollRef,
      onshortcutTouchMove,
      onItemClick
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .group {
      padding-bottom: 30px;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
