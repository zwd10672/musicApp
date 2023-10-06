import Loading from './loading'
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'
export const loadingDirective = {
  mounted (el, binding) {
    // el指向挂载的dom对象上
    const app = createApp(Loading)
    // 创建一个新节点
    const instance = app.mount(document.createElement('div'))
    // 复制给el对象
    el.instance = instance

    // 动态拿到title
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },

  updated (el, binding) {
    // 动态拿到title
    const title = binding.arg

    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append (el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) ===
  -1) {
    addClass(el, relativeCls)
  }
  // 挂载到作用的dom组件上
  el.appendChild(el.instance.$el)
}

// 定义remove函数
function remove (el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
