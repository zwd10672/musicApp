import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const iconMode = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })
  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })
  function changeMode () {
    // 修改播放状态
    const mode = (playMode.value + 1) % 3
    // 利用dispatch提交当前的播放状态
    store.dispatch('changeMode', mode)
  }
  return {
    iconMode,
    modeText,
    changeMode
  }
}
