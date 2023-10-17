import { ref } from 'vue'

export default function useMiddleInteractive () {
  // 歌词
  const middleRStyle = ref(null)
  // cd
  const middleLStyle = ref(null)
  // 获取到cd的dom
  const currentShow = ref('cd')

  const touch = {}
  // 当前视图
  let currentView = 'cd'
  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
  }
  function onMiddleTouchMove (e) {
    // 手指在屏幕上移动的距离
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    // 添加方向锁
    touch.directionLocked = ''
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }
    // 获取屏幕的宽度
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 屏幕移动的距离
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 屏幕移动的百分比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    middleLStyle.value = {
      opacity: 1 - touch.percent
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
  function onMiddleTouchEnd () {
    let offsetWidth
    let opacity

    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }
  return {
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
    currentShow,
    middleLStyle,
    middleRStyle
  }
}
