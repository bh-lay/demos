let cacheID = 0
// 卡片类
class Widget {
  constructor ({position = {}, layout = {}, data = {}} = {}) {
    let {width = 0, height = 0, top = 0, left = 0} = position
    this.id = ++cacheID
    this.position = {
      width,
      height,
      top,
      left,
      // 预览状态下的位置偏移量
      previewOffset: 0
    }
    this.data = data
    this.refresh(layout)
  }
  refresh ({gridSize = 0, gutter = 0} = {}) {
    let {width, height, top, left, previewOffset} = this.position
    this.screenPosition = {
      width: (width * gridSize - gutter) + 'px',
      height: (height * gridSize - gutter) + 'px',
      top: ((top + previewOffset) * gridSize) + 'px',
      left: (left * gridSize) + 'px'
    }
  }
  setPosition (obj, layout) {
    let keys = 'width,height,top,left'.split(',')
    keys.forEach(key => {
      if (typeof obj[key] === 'number') {
        this.position[key] = obj[key]
      }
    })
    this.refresh(layout)
  }
  applyOffset () {
    this.position.top += this.position.previewOffset
    this.setOffset(0)
  }
  setOffset (num) {
    this.position.previewOffset = num || 0
  }
  getOffset () {
    return this.position.previewOffset
  }
  parse () {
    let {width, height, top, left} = this.position
    return {
      position: {width, height, top, left},
      data: this.data
    }
  }
}

const tabNameDefault = ['图表一', '图表二', '图表三', '图表四', '图表五', '图表六']
class WidgetData {
  constructor () {
    /**
     * WidgetType
     *  none：尚未定义
     *  pure-chart：单图表
     *  row-charts：横向并列图表
     *  column-charts：竖向并列图表
     *  tab-charts：tab页
     **/
    this.widgetType = 'none'
    this.title = '未命名'
    this.chartList = []
    this.chartTitleList = []
    this.activeTabIndex = 0
    this.description = ''
  }
  /**
   * 初始化
   * @param {string} widgetType  卡片类型
   * @param {number 1-6} widgetLength 初始化卡片长度
   */
  init ({widgetType, widgetLength = 0}) {
    widgetLength = Math.min(widgetLength, 6)

    if (widgetType === 'pure-chart') {
      this.chartList = ['']
    } else {
      this.chartList = new Array(widgetLength).fill('')
    }
    if (widgetType === 'tab-charts') {
      this.chartTitleList = tabNameDefault.slice(0, widgetLength)
    }
    this.widgetType = widgetType
  }
  setData ({widgetType = 'none', title, chartList = [], chartTitleList = [], description = ''}) {
    this.widgetType = widgetType
    this.title = title || '未命名'
    this.chartList = chartList
    this.chartTitleList = chartTitleList
    this.description = description || ''
  }
}
export {
  Widget,
  WidgetData
}
