// 歌曲链接
const createOption = require('../util/option.js')
module.exports = async (query, request) => {
  const ids = String(query.id).split(',')
  const data = {
    ids: JSON.stringify(ids),
    br: parseInt(query.br || 999000),
  }
  const res = await request(
    `/api/song/enhance/player/url`,
    data,
    createOption(query),
  )
  // 根据id排序
  const result = res.body.data
  result.sort((a, b) => {
    return ids.indexOf(String(a.id)) - ids.indexOf(String(b.id))
  })
  for (const item of result) {
    item.url = item.url.replace(
      /(m\d+?)(?!c)\.music\.126\.net/,
      '$1c.music.126.net',
    )
  }
  return {
    status: 200,
    body: {
      code: 200,
      data: result,
    },
  }
}
