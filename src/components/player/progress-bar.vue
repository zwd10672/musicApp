<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      offset: 0
    }
  },
  computed: {
    btnStyle () {
      return `transform:translate3d(${this.offset}px,0,0)`
    },
    progressStyle () {
      return `width:${this.offset}px`
    }
  },
  watch: {
    progress (newProgress) {
      // 拿到播放器的进度条
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newProgress
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    onTouchStart (e) {
      // 拿到拖动播放器进度条的宽度
      this.touch.x1 = e.touches[0].pageX
      // 获取到播放时长对应的进度条的宽度
      this.touch.begiinWidth = this.$refs.progress.clientWidth
    },
    onTouchMove (e) {
      // 获取到每次拖动进度条的宽度
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.begiinWidth + delta
      // 拿到播放器的进度条宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd () {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onClick (e) {
      const rect = this.$el.getBoundingClientRect()
      // 播放进度
      const offsetWidth = e.pageX - rect.left
      // 播放器的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
