export const text2translation = (input) => {
  const bl = /^[\r\n]+/gm
  const groups = input.replace(/\r/g, '').split(bl)
  const list = []
  groups.forEach((group) => {
    const arr = group.split('\n')
    if(!arr[0]) return
    const translation = {
      ch: arr[0].trim(),
      en: (arr[1] || '').trim(),
      remarks: (arr[2] || '').trim(),
      collapsed: true,
      checked: false
    }
    list.push(translation)
  })
  return list
}
