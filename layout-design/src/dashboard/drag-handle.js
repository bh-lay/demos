const dragHandle = (event, {move, end}) => {
  let startX = event.clientX
  let startY = event.clientY

  event.preventDefault && event.preventDefault()
  event.stopPropagation && event.stopPropagation()

  document.addEventListener('mousemove', mousemove, false)
  document.addEventListener('mouseup', up, false)

  function mousemove (e) {
    let clientX = e.clientX
    let clientY = e.clientY
    let xOffset = clientX - startX
    let yOffset = clientY - startY

    // 做了点儿猥琐的事情，你懂得
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
    move && move({
      clientX,
      clientY,
      xOffset,
      yOffset
    })
  }
  function up (e) {
    document.removeEventListener('mousemove', mousemove, false)
    document.removeEventListener('mouseup', up, false)

    let clientX = e.clientX
    let clientY = e.clientY
    let xOffset = clientX - startX
    let yOffset = clientY - startY

    end && end({
      clientX,
      clientY,
      xOffset,
      yOffset
    })
  }
}

export default dragHandle
