import { onMounted, onUnmounted, ref } from 'vue'
import BScroll from '@better-scroll/core'

export const useScroll = (wrapperRef) => {
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value)
  })
  onUnmounted(() => {
    scroll.value.detroy()
  })
}
