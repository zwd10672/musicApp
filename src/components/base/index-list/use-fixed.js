import { nextTick, ref, watch, computed } from 'vue'

export default function useFixed (props) {
  // 定义一个常量，即每一个标题的高度
  const TITLE_HEIGHT = 30
  // 获取到通过ref绑定的groupRef组件
  const groupRef = ref(null)
  // 定义一个数组记录各个li之间的高度
  const listHeights = ref([])
  // 纵向滚动的值
  const scrollY = ref(0)
  // 定义拿到的下标
  const currentIndex = ref(0)
  // 当前组到下一个组之间的距离
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 定义一个计算属性根据当前组到下一组的距离 动态添加一个css样式
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT)
      ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  // 监听滚动
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate () {
    // 定义一个list 拿到表格的每一个li
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    // 记录区间的高度
    let height = 0
    // 初始化数组
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  // 拿到pos纵向滚动距离
  function onScroll (pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle
  }
}
