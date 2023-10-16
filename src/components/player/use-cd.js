import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
export default function useCd () {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => {
    // 动态添加旋转样式，如果是播放状态则修改样式为playing
    return playing.value ? 'playing' : ''
  })
  watch(playing, (newPlaying) => {
    if (!newPlaying.value) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })
  // wrapper为外层的样式 inner为内层的样式
  function syncTransform (wrapper, inner) {
    // 获取当前状态下外层的transform属性，即旋转到的当前位置
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 获取当前状态下内层的transform属性，即旋转到的当前位置
    const innerTransform = getComputedStyle(inner).transform
    // 让外层的样式和内层的保持一致
    wrapper.style.transform = wrapperTransform === 'none'
      ? innerTransform : innerTransform.concat('', wrapperTransform)
  }
  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
