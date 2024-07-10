import { save, remove, clear } from '@/assets/js/array-store'
import { SEARCH1_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'
export default function useSearchHistory () {
  const store = useStore()
  const maxLen = 100

  function saveSearch (query) {
    const searchs = save(query, SEARCH1_KEY, (item) => {
      return item === query
    }, maxLen)
    store.commit('setSearchHistory', searchs)
  }

  function deleted (query) {
    const searchs = remove(SEARCH1_KEY, (item) => {
      return item === query
    })
    store.commit('setSearchHistory', searchs)
  }

  function clearSearch () {
    const searchs = clear(SEARCH1_KEY)
    store.commit('setSearchHistory', searchs)
  }

  return {
    saveSearch,
    deleted,
    clearSearch
  }
}
