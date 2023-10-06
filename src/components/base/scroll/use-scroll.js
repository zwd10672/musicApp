import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import {
  onMounted, onUnmounted,
  //  onActivated, onDeactivated,
  ref
} from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    // if (options.probeType > 0) {
    //   scrollVal.on('scroll', (pos) => {
    //     emit('scroll', pos)
    //   })
    // }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  // onActivated(() => {
  //   scroll.value.enable()
  //   scroll.value.refresh()
  // })

  // onDeactivated(() => {
  //   scroll.value.disable()
  // })

  return scroll
}
