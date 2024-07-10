import storage from 'good-storage'

// 添加到列表
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 判断列表中歌曲在列表中的位置
  // 如果返回的index为1，说明在第一位，直接return出去，不做处理
  if (index === 1) {
    return
  }
  // 如果大于0，说明位置不是1，将歌曲从原列表中删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 删除之后再添加到头部
  arr.unshift(val)
  // 如果数组的长度大于maxLen，则删除最后的歌曲
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
// 删除歌曲
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
// 加载收藏中的歌曲
export function load (key) {
  return storage.get(key, [])
}
// 清除列表数据
export function clear (key) {
  storage.remove(key)
  return []
}

export function saveAll (items, key) {
  storage.set(key, items)
}
