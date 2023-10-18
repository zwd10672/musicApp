import { ref, watch, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slider from '@better-scroll/slide'
BScroll.use(Slider)
export default function useMiniSlider () {
  // 拿到播放器功能dom
  const sliderWrapperRef = ref(null)
  // 获取到组件实例
  const slider = ref(null)
  const store = useStore()
  const playlist = computed(() => store.state.playlist)
  const fullScreen = computed(() => store.state.fullScreen)
  const currentIndex = computed(() => store.state.currentIndex)
  // const currentIndex = computed(() => store.getters.currentIndex)
  const sliderShow = computed(() => {
    // 双!将值转化为布尔
    return !fullScreen.value && !!playlist.value
  })

  onMounted(() => {
    // 获取到组件的实例
    let sliderVal
    // mini-slider显示的时候做一个初始化
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
  })
  onUnmounted(() => {
    // 如果满足slider有值得时候才会destory
    if (slider.value) {
      slider.value.destory()
    }
  })

  return {
    sliderWrapperRef,
    slider
  }
}
