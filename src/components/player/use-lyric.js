import { getLyric } from '@/service/song'
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import Lyric from 'lyric-parser'

export default function useLyric ({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref(0)
  const playingLyric = ref(null)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 如果当前播放歌曲改变的话，先停止上一条的逻辑，并把上条歌曲的歌词和歌词行数变成空
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = ''
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', { song: newSong, lyric })
    // 判断获取到的歌词是不是当前歌曲的，如果不是就停止以下操作
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 使用lyric-parser，执行handleLyric回调函数
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 判断是否存在歌词
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      // 使用正则结构数据
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})]/g, '')
    }
  })
  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  // 定义停止歌词继续滑动的函数
  function stopLyric () {
    // 拿到当前歌曲的歌词
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  // Lyric的回调函数，歌词每滚动一下就会执行一下该函数
  function handleLyric ({ lineNum, txt }) {
    // 根据播放时长将拿到行数
    currentLineNum.value = lineNum
    // 当前播放歌词
    playingLyric.value = txt
    // 拿到scroll对象
    const scrollComp = lyricScrollRef.value
    // 拿到下面的行对象
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      // 如果行数大于5，让当前播放的那一行数量减五，拿到较中间的一行
      const lineEl = listEl.children[lineNum - 5]
      // 利用scroll的scrollToElement时间，滚动到当前行
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      // 如果不大于5，不做处理
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return {
    currentLineNum,
    currentLyric,
    lyricListRef,
    lyricScrollRef,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
