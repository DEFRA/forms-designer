/**
 * @template {unknown[]} ArrayType
 * @param {ArrayType} arr
 * @param {number} from
 * @param {number} to
 */
export function arrayMove(arr, from, to) {
  const elm = arr.splice(from, 1)[0]
  arr.splice(to, 0, elm)
  return arr
}

/**
 * @param {string} [nameOrPath]
 */
export function controllerNameFromPath(nameOrPath) {
  const controllers = [
    {
      name: 'StartPageController',
      path: './pages/start.js'
    },
    {
      name: 'SummaryPageController',
      path: './pages/summary.js'
    }
  ]

  const controller = controllers.find(({ path }) => path === nameOrPath)
  return controller?.name ?? nameOrPath
}
