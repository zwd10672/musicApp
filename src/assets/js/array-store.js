import storage from 'good-storage'

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArr (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 保存歌曲到收藏
export function save (item, key, compare, maxLen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}
// 移除收藏中的歌曲
export function remove (key, compare) {
  const items = storage.get(key, [])
  deleteFromArr(items, compare)
  storage.set(key, items)
  return items
}
export function load (key) {
  return storage.get(key, [])
}
