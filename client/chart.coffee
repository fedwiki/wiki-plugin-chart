###
 * Federated Wiki : Chart Plugin
 *
 * Licensed under the MIT license.
 * https://github.com/fedwiki/wiki-plugin-chart/blob/master/LICENSE.txt
###

sanitize = require 'sanitize-caja'

last = (array) ->
  array[array.length-1]

formatTime = (time) ->
  d = new Date (if time > 10000000000 then time else time*1000)
  mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
  h = d.getHours()
  am = if h < 12 then 'AM' else 'PM'
  h = if h == 0 then 12 else if h > 12 then h - 12 else h
  mi = (if d.getMinutes() < 10 then "0" else "") + d.getMinutes()
  "#{h}:#{mi} #{am}<br>#{d.getDate()} #{mo} #{d.getFullYear()}"

display = ($item, data) ->
  [time, sample] = data
  $item.find('p:first').text sample.toFixed(1)
  $item.find('p:last').html formatTime(time)

findData = (item, thumb) ->
  for data in item.data
    return data if data[0] is thumb
  null

window.plugins.chart =

  emit: ($item, item) ->
    [time, sample] = last(item.data)
    chartElement = $('<p />').addClass('readout').appendTo($item).text(sample)
    captionElement = $('<p />').html(wiki.resolveLinks(item.caption, sanitize)).appendTo($item)

  bind: ($item, item) ->

    lastThumb = null

    $item.find('p:first')
      .mousemove (e) ->
        return unless (data = item.data[Math.floor(item.data.length * e.offsetX / e.target.offsetWidth)])?
        [time, sample] = data
        return if time == lastThumb || null == (lastThumb = time)
        display $item, data
        $item.trigger('thumb', +time)
      .dblclick ->
        wiki.dialog "JSON for #{item.caption}", $('<pre/>').text(JSON.stringify(item.data, null, 2))

    $('.main').on 'thumb', (evt, thumb) ->
      if thumb != lastThumb and (data = findData item, thumb)
        lastThumb = thumb
        display $item, data
