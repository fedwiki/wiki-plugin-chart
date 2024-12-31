/*
 * Federated Wiki : Chart Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-chart/blob/master/LICENSE.txt
 */

const last = array => {
  return array[array.length - 1]
}

const formatTime = time => {
  const d = new Date(time > 10000000000 ? time : time * 1000)
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
  let h = d.getHours()
  const am = h < 12 ? 'AM' : 'PM'
  h = h === 0 ? 12 : h > 12 ? h - 12 : h
  const mi = d.getMinutes() < 10 ? '0' : '' + d.getMinutes()
  return `${h}:${mi} ${am}<br>${d.getDate()} ${mo} ${d.getFullYear()}`
}

const display = ($item, data) => {
  const [time, sample] = data
  $item.find('p:first').text(sample.toFixed(1))
  $item.find('p:last').html(formatTime(time))
}

const findData = (item, thumb) => {
  return item.data.find(data => data[0] === thumb) ?? null
}

window.plugins.chart = {
  emit: ($item, item) => {
    const [time, sample] = last(item.data)
    const chartElement = $('<p />').addClass('readout').appendTo($item).text(sample)
    const captionElement = $('<p />').html(wiki.resolveLinks(item.caption)).appendTo($item)
  },
  bind: ($item, item) => {
    let lastThumb = null
    $item
      .find('p:first')
      .on('mousemove', e => {
        if (typeof e.offsetX == 'undefined') {
          e.offsetX = e.pageX - $(e.target).offset().left
        }
        const data = item.data[Math.floor((item.data.length * e.offsetX) / e.target.offsetWidth)]
        if (!data) return
        const [time, sample] = data

        if (time === lastThumb || time === null) return
        lastThumb = time
        display($item, data)
        $item.trigger('thumb', +time)
      })
      .on('dblclick', () => {
        wiki.dialog('JSON for ${item.caption}', $('<pre/>').text(JSON.stringify(item.data, null, 2)))
      })
    $('.main').on('thumb', (evt, thumb) => {
      const data = findData(item, thumb)
      if (thumb !== lastThumb && data) {
        lastThumb = thumb
        display($item, data)
      }
    })
  },
}
