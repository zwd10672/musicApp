import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation () {
  const cdWrapperRef = ref(null)

  let entering = true
  let leaveing = true
  // 进入时候执行
  function enter (el, done) {
    if (leaveing) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosSAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      100: {
        transform: 'translation3d(0,0,0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45,0,0.55,1)'
      }
    })

    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }
  // 进入之后
  function afterEnter () {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value = ''
  }
  // 离开时候
  function leave () {
    if (entering) {
      afterEnter()
    }
    leaveing = true
    const { x, y, scale } = getPosSAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45,0,0.55,1)'
    cdWrapperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
    cdWrapperEl.addEventListener('transitioned', next)

    function next (done) {
      cdWrapperEl.removeEventListener('transitioned', next)
      done()
    }
  }
  // 离开之后
  function afterLeave () {
    leaveing = false
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }
  // 获取位置的函数
  function getPosSAndScale () {
    // 目标位置
    const targetWidth = 40
    const paddingLeft = 40
    // 播放器页面顶部到cd的距离
    const paddingTop = 80
    // mini播放器圆心到底部的距离
    const paddingBottom = 30
    // cd的宽度
    const width = window.innerWidth * 0.8
    // cd移到目标位置的距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    // cd与mini播放器cd的比例
    const scale = targetWidth / width

    return {
      x, y, scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
