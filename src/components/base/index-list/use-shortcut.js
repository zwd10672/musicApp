import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 18
  // 拿到组件实例对象
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })
  const touch = {}
  // 手指点击侧边栏事件
  function onshortcutTouchStart (e) {
    touch.y1 = e.touches[0].pageY
    // 拿到索引
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  // 手指滑动侧边栏事件
  function onshortcutTouchMove (e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }
  function scrollTo (index) {
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 计算目标滚动元素
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }
  return {
    shortcutList,
    onshortcutTouchStart,
    scrollRef,
    onshortcutTouchMove
  }
}
