// 导入插件
import Cookies from "js-cookie";

// 存储的key名字
const SortList = "sortList";

export function getSortList() {
  return Cookies.get(SortList);
}

export function setSortList(sort) {
  return Cookies.set(SortList, sort);
}

export function removeSortList() {
  return Cookies.remove(SortList);
}
