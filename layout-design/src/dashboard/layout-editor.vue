<style lang="stylus" rel="stylesheet/stylus" scoped>
  *
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

  .dash-wrapper
    position absolute
    top 0
    right 0
    bottom 0
    left 0

  .report-container
    margin 0 5px 10px

  .report-page-outer
    position absolute
    width 100%
    height 100%
    top 10px
    left 0
    overflow auto
    &::-webkit-scrollbar
      display: none
  .report-page
    position relative
    padding 10px 0

  .widget-drag-preview
    position absolute
    background #d5dadd
    transition .3s

  .widget
    position absolute
    background #fff
    transition box-shadow .3s ease-in-out
    /*overflow hidden*/
    color: #888
    .widget-move
      position relative
      height 100%
      cursor: move
    .widget-resize
      position absolute
      right 0
      bottom 0
      width 30px
      height 30px
      line-height 30px
      text-align center
      cursor: se-resize
      &:before
        content: ''
        display inline-block
        width 0
        height 0
        border-width 0 0 10px 10px
        border-style solid
        border-color transparent transparent #c2ced6 transparent
    .widget-inner
      position absolute
      top 35px
      left 20px
      width calc(100% - 50px)
      height calc(100% - 50px)
    .widget-title
      position absolute
      top 10px
      left 15px
      line-height 20px
      font-size 15px
      font-weight bold
      color #33424d
    .widget-desc
      padding-left 5px
      padding-right 5px
      /*height: 50px;*/
      margin-top 10px
      overflow auto
      line-height 1.5
      font-size 13px
      color #40535f
    .widget-tools
      position absolute
      top 0
      right 10px
      a
        display inline-block
        width 30px
        height 40px
        text-align center
        line-height 40px
        color #7e8c8d
        font-size 12px
        &:hover
          color #1994e6
    .widget-resize,
    .widget-tools
      opacity 0
      transition .3s ease-in-out
    &:hover
    &.active
      z-index 1
      box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1), 0 16px 24px 0 rgba(170, 182, 206, .36)
      .widget-resize,
      .widget-tools
        opacity 1
    &.active
      transition none

  .chart-group
    position relative
    height 100%
    &.chart-group-with-desc
      height calc(100% - 50px)
  // 单图表
  .chart-group-pure-chart
    .chart-group-item
      position relative
      height 100%

  .chart-group-row-charts
    display flex
    .chart-group-item
      position relative
      height 100%
      flex 1 1 0
  .chart-group-column-charts
    display flex
    flex-flow column
    .chart-group-item
      position relative
      flex 1 1 0
  .chart-group-tab-charts
    overflow hidden
    .chart-tab
      height 30px
      border-bottom 1px solid #e2edf8
      .chart-tab-item
        float left
        height 28px
        padding 0 10px
        line-height 28px
        font-size 14px
        cursor pointer
        &.active
          border-bottom 2px solid #1fa1e5
          color #336f99
    .chart-group-item
      position absolute
      width 100%
      height calc(100% - 30px)
      top 30px
      left 100%
      transition .2s
      &.active
        left 0
  .chart-item
    position relative
    top 40px
    height calc(100% - 45px)
    margin 0
    .chart-tools
      position absolute
      top -40px
      right 0
      z-index 2
      background #fafafa
      opacity 0
    &:hover
      .chart-tools
        opacity 1
  .report-add-widget
    padding-bottom 160px
    text-align center
</style>
<template>
  <div class="dash-wrapper">
    <div class="report-page-outer" ref="scrollOuter">
      <!-- 报表主容器 -->
      <div class="report-container" ref="widthOuter">
        <!-- 卡片容器 -->
        <div class="report-page"
             :style="{
            height: layout.height + 'px',
            'margin-left': layout.gutter + 'px'
          }"
        >
          <!-- 拖拽投影，用于辅助拖拽 -->
          <div class="widget-drag-preview"
               v-if="!!activeWidget"
               :style="shadowWidget.screenPosition"
          >
          </div>
          <!-- 卡片实体 -->
          <div class="widget"
               v-if="widgetList.length"
               v-for="widget in widgetList"
               :key="widget.id"
               :style="widget.screenPosition"
               :class="[widget === activeWidget ? 'active' : '']"
          >
            <div class="widget-title" v-if="widget.data.widgetType !== 'none'">{{widget.data.title}}</div>
            <!-- 拖拽移动卡片位置 -->
            <div class="widget-move"
                 draggable
                 @mousedown="handleWidgetMove($event, widget)"
            ></div>
            <!-- 卡片主体 -->
            <div class="widget-inner">
              <!-- 卡片类型选择器 -->
              <widgetTypeSelector
                v-if="widget.data.widgetType === 'none'"
                :widgetID="widget.id"
                @typeSelected="onTypeSelected"
              ></widgetTypeSelector>
              <!-- 卡片内图表组 -->
              <div v-else :class="[
                'chart-group',
                'chart-group-' + widget.data.widgetType,
                widget.data.description ? 'chart-group-with-desc' : ''
              ]">
                <!-- 卡片内图表 tab -->
                <div
                  v-if="widget.data.widgetType === 'tab-charts'"
                  class="chart-tab"
                >
                  <div
                    v-for="(title, index) in widget.data.chartTitleList"
                    :key="index"
                    :class="['chart-tab-item', widget.data.activeTabIndex === index ? 'active' :'']"
                    @click="widget.data.activeTabIndex = index"
                  >
                  {{title}}
                  </div>
                </div>
                <!-- 卡片内图表列表 -->
                <div
                  v-if="widget.data.chartList.length"
                  v-for="(chart, index) in widget.data.chartList"
                  :key="index"
                  :class="['chart-group-item', widget.data.activeTabIndex === index ? 'active' :'']"
                >
                  <div v-if="chart && chart.length" class="chart-item">
                    <slot
                      name="widget"
                      :widgetID="widget.id"
                      :chart="getChartByID(widget.data.chartList[index])"
                      :position="widget.position"
                      :screenPosition="widget.screenPosition"
                    ></slot>
                    <div class="chart-tools">
                      <slot
                        name="tools-bar"
                        :widgetID="widget.id"
                        :chart="getChartByID(widget.data.chartList[index])"
                      ></slot>
                    </div>
                  </div>
                  <widgetChartForDrag
                    v-else
                    :widgetID="widget.id"
                    :chartIndex="index"
                    @chartInsert="chartInsertToWidget"
                  ></widgetChartForDrag>
                </div>
              </div>
              <div class="widget-desc" v-if="widget.data.description">
                {{widget.data.description}}
              </div>
            </div>
            <!-- 拖拽控制卡片大小 -->
            <div class="widget-resize" draggable @mousedown="handleWidgetResize($event, widget)"></div>
            <!-- 卡片工具按钮 -->
            <div class="widget-tools" v-if="widget.data.widgetType !== 'none'">
              <a title="删除" href="javascript:void(0)" class="delete" @click="deleteWidget(widget.id, widget)">
                删除
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="report-add-widget">
        <a class="button" @click="addEmptyWidget" type="primary">增加卡片</a>
      </div>
    </div>
  </div>
</template>
<script>


  import widgetTypeSelector from './widget-type-selector.vue'
  import widgetChartForDrag from './widget-chart-for-drag.vue'
  import {Widget, WidgetData} from './Widget.js'
  import dragHandle from './drag-handle.js'
  const uuid = () => {
    // 从时间戳取值，精细到毫秒
    let dateKey = new Date().getTime().toString(36);
    // 逆序排列
    dateKey = dateKey.split("").reverse().join("");
    // 补齐长度
    function leftPad (input, length){
      if (input.length < length) {
        var needLength = length - input.length;
        let paddingKey = new Array(needLength + 1).join('x');
        return paddingKey + input;
      } else {
        return input
      }
    }
    function rand(){
      // 生成一个随机字符串，长度在五位以内
      var key = Math.floor(Math.random() * 60000000).toString(36);
      // 补齐长度
      return leftPad(key, 5);
    }
    return [dateKey, rand(), rand(), rand()].join('-')
  }
  const CloneDeep = object => {
    return JSON.parse(JSON.stringify(object))
  };
  const sortWidgetList = list => {
    // 将 widgets 按垂直方向排序，水平方向为第二顺序
    list.sort((widgetA, widgetB) => {
      let verticalCompare = widgetA.position.top - widgetB.position.top
      return verticalCompare !== 0 ? verticalCompare : (widgetA.position.left - widgetB.position.left)
    })
  }
  // 判断两条线段是否相交
  const isLineCollision = (x1, w1, x2, w2) => {
    return !(x1 >= x2 + w2 || x1 + w1 <= x2)
  }
  // 从列表中删除某一项
  const removeItemFromList = (list, item) => {
    let indexOf = list.indexOf(item);
    if (indexOf >= 0) {
      list.splice(indexOf, 1);
    }
  }
  // 矩形碰撞检测
  function isRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 >= x2 && x1 >= x2 + w2) {
      return false
    } else if (x1 <= x2 && x1 + w1 <= x2) {
      return false
    } else if (y1 >= y2 && y1 >= y2 + h2) {
      return false
    } else if (y1 <= y2 && y1 + h1 <= y2) {
      return false
    }
    return true
  }

  // 数组去重
  function uniqueArray(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
      if (res.indexOf(arr[i]) === -1) {
        res.push(arr[i])
      }
    }
    return res
  }

  export default {
    name: 'dashBoardLayoutEditor',
    props: {
      showFilter: {},
      widgets: {},
      charts: {},
      filters: {},
    },
    components: {
      widgetChartForDrag,
      widgetTypeSelector
    },
    data() {
      return {
        count: 0,
        globalStyleSheet: {},
        layout: {
          width: 200,
          height: 800,
          horizontalGridCount: 12,
          gridSize: 0,
          gutter: 10
        },
        widgetList: [],
        shadowWidget: new Widget(),
        activeWidget: null,
        timeInterval: null,

        _triggerChartChangedTimer: null
      }
    },
    mounted() {
      this.refresh()
      window.addEventListener('resize', this.refresh)
    },
    beforeDestroy() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
      window.removeEventListener('resize', this.refresh)
    },
    methods: {
      // 根据 ID 查找图表
      getChartByID (chartUUID) {
        for (let i = 0, total = this.charts.length; i < total; i++) {
          if (this.charts[i].id === chartUUID) {
            return this.charts[i]
          }
        }
        return null
      },
      // 根据 ID 查找卡片
      getWidgetByID (widgetID) {
        for (let i = 0, total = this.widgetList.length; i < total; i++) {
          if (this.widgetList[i].id === widgetID) {
            return this.widgetList[i]
          }
        }
        return null
      },
      // 计算图表有没有被使用
      markIsChartUsed () {
        // 获取所有被使用的图表 ID 列表
        let usedChartList = this.widgetList.map(({data}) => data.chartList || [])
        // 二维数组打平为一维数组
        usedChartList = [].concat.apply([], usedChartList)
        // 遍历所有图表
        this.charts.forEach(chart => {
          let chartUUID = chart.id
          // 标记是否已被使用
          chart.beUsed = usedChartList.indexOf(chartUUID) > -1
        })
      },
      // 将图表插入至卡片
      chartInsertToWidget ({widgetID, chartIndex, chartUUID}) {
        let widget = this.getWidgetByID(widgetID)
        if (widget) {
          // 关联图表 ID
          this.$set(widget.data.chartList, chartIndex, chartUUID)
        }
        // 通知图表数据发生了变化
        this._triggerChartChanged()
      },
      // 将图表从卡片中移除
      removeChartFromWidget({widgetID, chartUUID, chartId}){
        let widget = this.getWidgetByID(widgetID)
        if (widget) { // 重置 widget 内的图表 id
          let list = widget.data.chartList
          let indexOf = list.indexOf(chartUUID);
          if (indexOf >= 0) {
            this.$set(list, indexOf, '')
          }
        }
        // 通知图表数据发生了变化
        this._triggerChartChanged(null, chartId)
      },
      // 将图表从所有卡片中移除
      removeChart(chartUUID){
        // 遍历所有卡片
        this.widgetList.forEach(widget => {
          // 查看卡片内的图表列表
          let list = widget.data.chartList
          let indexOf = list.indexOf(chartUUID);
          // 有则置空
          if (indexOf >= 0) {
            this.$set(list, indexOf, '')
          }
        })
        // 再将图表数据删除掉
        for (let index = 0, total = this.charts.length; index < total; index++) {
          if (this.charts[index].id === chartUUID) {
            this.charts.splice(index, 1)
            break;
          }
        }
        // 通知图表数据发生了变化
        this._triggerChartChanged()
      },
      // 触发图表数据变动事件(私有方法)
      _triggerChartChanged(isForbiddenEmit, chartUUID){
        clearTimeout(this._triggerChartChangedTimer)
        this._triggerChartChangedTimer = setTimeout(() => {
          // 计算图表有没有被使用
          if (this.charts && this.charts.length) {
            this.markIsChartUsed()
          }
          if (!isForbiddenEmit && isForbiddenEmit !== -1) {
            this.$emit('chartChanged', chartUUID)
          } else if (isForbiddenEmit === -1) {
            let chartIds = chartUUID.data.chartList.filter(filter => {
              return filter !== ''
            })
            this.$emit('chartChangedWidthDeleteGlobal', chartIds)
          } else if (chartUUID && typeof(isForbiddenEmit) === 'object') {
            this.$emit('chartChangedWidthDeleteGlobal', chartUUID)
          }
        }, 50)
      },
      // 添加空白的卡片
      addEmptyWidget() {
        let top = this.getEndGrid()
        this._addWidget({
          position: {
            width: 12,
            height: 6,
            top,
            left: 0
          },
          data: {
            widgetType: 'none'
          }
        })
        // this.$nextTick(() => {
        //   // this.$refs.scrollOuter.scrollTop = this.$refs.scrollOuter.scrollHeight
        // })

      },
      // 当选择了卡片类型后
      onTypeSelected ({widgetID, type}) {
        let widget = this.getWidgetByID(widgetID)
        if (widget) {
          let widgetData = new WidgetData()
          widgetData.init({
            widgetType: type,
            widgetLength: 3
          })
          // 关联图表 ID
          this.$set(widget, 'data', widgetData)
        }
      },
      setWatermark () {},
      refresh() {
        let outerWidth
        if (this.$refs.widthOuter) {
          outerWidth = this.$refs.widthOuter.clientWidth
        } else {
          outerWidth = 0
        }
        if (outerWidth === 0) {
          return
        }
        this.layout.width = outerWidth - this.layout.gutter
        this.layout.gridSize = this.layout.width / this.layout.horizontalGridCount
        this.widgetList.forEach(widget => widget.refresh(this.layout))
        this._resetHeight()
      },
      handleWidgetMove (event, widget) {
        this.activeWidget = widget
        // 标记初始位置
        this.shadowWidget.setPosition({
          width: widget.position.width,
          height: widget.position.height,
          top: widget.position.top,
          left: widget.position.left
        }, this.layout)

        dragHandle(event, {
          move: ({xOffset, yOffset}) => {
            // move
            let {position, screenPosition} = widget
            let maxLeft = (this.layout.horizontalGridCount - position.width) * this.layout.gridSize

            let newTop = position.top * this.layout.gridSize + yOffset
            let newLeft = position.left * this.layout.gridSize + xOffset

            newTop = Math.max(0, newTop)
            newLeft = Math.max(0, newLeft)
            newLeft = Math.min(maxLeft, newLeft)

            this.shadowWidget.setPosition({
              top: Math.floor(newTop / this.layout.gridSize),
              left: Math.floor(newLeft / this.layout.gridSize)
            }, this.layout)
            screenPosition.top = newTop + 'px'
            screenPosition.left = newLeft + 'px'
            this._previewWidgets()
          },
          end: () => {
            this._dragEnd()
          }
        })
      },
      handleWidgetResize (event, widget) {
        this.activeWidget = widget

        this.shadowWidget.setPosition({
          width: widget.position.width,
          height: widget.position.height,
          top: widget.position.top,
          left: widget.position.left
        }, this.layout)

        dragHandle(event, {
          move: ({xOffset, yOffset}) => {
           let {position, screenPosition} = widget
            let maxWidth = (this.layout.horizontalGridCount - position.left) * this.layout.gridSize - this.layout.gutter
            let startWidth = position.width * this.layout.gridSize - this.layout.gutter
            let startHeight = position.height * this.layout.gridSize - this.layout.gutter
            let newWidth = startWidth + xOffset
            let newHeight = startHeight + yOffset

            newWidth = Math.max(this.layout.gridSize * 2 - this.layout.gutter, newWidth)
            newWidth = Math.min(maxWidth, newWidth)
            newHeight = Math.max(this.layout.gridSize * 2 - this.layout.gutter, newHeight)
            this.shadowWidget.setPosition({
              width: Math.ceil(newWidth / this.layout.gridSize),
              height: Math.ceil(newHeight / this.layout.gridSize)
            }, this.layout)
            screenPosition.width = newWidth + 'px'
            screenPosition.height = newHeight + 'px'
            this._previewWidgets()
          },
          end: () => {
            this._dragEnd()
          }
        })
      },
      _dragEnd(event) {
        // this._previewWidgets()
        this.shadowWidget.applyOffset()
        this.activeWidget.setPosition({
          width: this.shadowWidget.position.width,
          height: this.shadowWidget.position.height,
          top: this.shadowWidget.position.top,
          left: this.shadowWidget.position.left
        }, this.layout)

        this.touchCeiling(this.widgetList)
        this.widgetList.forEach(widget => widget.refresh(this.layout))

        // 应用预览状态下的偏移量
        this.widgetList.forEach(widget => widget.applyOffset())
        this._resetHeight()
        this.activeWidget = null
      },
      // 根据拖拽预览数据，自动调整布局
      _previewWidgets() {
        if (this.widgetList.length < 2) {
          return
        }
        // 获取除了被拖拽以外的其他  widgets
        this.shadowWidget.setOffset(0)
        let restWidgets = this.widgetList.filter(widget => {
          widget.setOffset(0)
          return widget !== this.activeWidget
        })
        // 获取界面上用于预览的所有 widget，包括影子，但是不包括被拖拽的 widget
        let repainList = restWidgets.concat(this.shadowWidget)

        // 第一步：先做一遍自动吸顶效果，排除被拖拽的 widget、shadowWidget
        this.touchCeiling(restWidgets)

        // 第二步：根据 shadowWidget 的数据，查找碰撞到的 widget，不包含影子对象
        let collisionWidgets = restWidgets.filter(widget => {
          let {width, height, top, left} = this.shadowWidget.position
          let rect = widget.position
          return isRectCollision(left, top, width, height, rect.left, rect.top + rect.previewOffset, rect.width, rect.height)
        })

        // 第三步：查找出受拖拽影响的 widgets，排除被拖拽的 widget 与影子 widget
        let dirtyWidgetList = this.getDeepFollowing(collisionWidgets)
        dirtyWidgetList = dirtyWidgetList.filter(widget => {
          return widget !== this.activeWidget && widget !== this.shadowWidget
        })

        // 第四步：将受到拖拽影响的 widgets 向下挪出空位
        dirtyWidgetList.forEach(widget => widget.setOffset(100))

        // 第五步：再次执行自动吸顶效果
        this.touchCeiling(repainList)

        // 最后：计算完毕，触发位置更新
        restWidgets.forEach(widget => {
          widget.refresh(this.layout)
        })
      },
      // 自动吸顶效果
      touchCeiling(widgetList) {
        sortWidgetList(widgetList)
        widgetList.forEach(widget => {
          let followedWidget = this.findFollowedWidget(widget, widgetList)
          let followedWidgetBottom = 0
          if (followedWidget) {
            followedWidgetBottom = followedWidget.position.top + followedWidget.getOffset() + followedWidget.position.height
          }
          widget.setOffset(followedWidgetBottom - widget.position.top)
        })
      },
      // 查找能够影响自身位置的 widget，仅返回 widget 或 null
      findFollowedWidget(upperWidget, widgetList) {
        let {width, top, left, previewOffset} = upperWidget.position
        // 获取向上投影所覆盖到的 widgets
        let findWidgetsAtHorizonGrid = widgetList.filter(widget => {
          let rect = widget.position
          // 排除垂直方向下方的 widget
          let islower = rect.top + rect.previewOffset < top + previewOffset
          return islower && isLineCollision(left, width, rect.left, rect.width)
        })
        // 未匹配上，或者只有一个 widget 无需做去重处理
        if (findWidgetsAtHorizonGrid.length <= 1) {
          return findWidgetsAtHorizonGrid[0] || null
        }
        // 按照底部位置逆序排序
        findWidgetsAtHorizonGrid.sort((widgetA, widgetB) => {
          return (widgetB.position.top + widgetB.getOffset() + widgetB.position.height) - (widgetA.position.top + widgetA.getOffset() + widgetA.position.height)
        })
        return findWidgetsAtHorizonGrid[0] || null
      },
      // 查找受自身影响的 widget 垂直方向无间隔，并且水平方向有重合
      findFollowingWidgets(upperWidget, list) {
        let {width, height, top, left, previewOffset} = upperWidget.position

        list = typeof list === 'undefined' ? this.widgetList : list

        // 先在水平方向找到相交的 widgets
        let findWidgetsAtHorizonGrid = list.filter(widget => {
          let rect = widget.position
          // 排除垂直方向上方的 widget
          if (rect.top + rect.previewOffset < top + previewOffset + height) {
            return false
          }
          return isLineCollision(left, width, rect.left, rect.width)
        })
        // 未匹配上，或者只有一个 widget 无需做去重处理
        if (findWidgetsAtHorizonGrid.length <= 1) {
          return findWidgetsAtHorizonGrid
        }
        // 按照顶部位置排序
        findWidgetsAtHorizonGrid.sort((widgetA, widgetB) => {
          return (widgetA.position.top + widgetA.getOffset()) - (widgetB.position.top + widgetB.getOffset())
        })
        // 逆序删除与前面有相交的 widgets
        for (let index = findWidgetsAtHorizonGrid.length - 1; index !== 0; index--) {
          let checkWidget = findWidgetsAtHorizonGrid[index]
          let checkWidgetRect = checkWidget.position
          let compareWidgets = findWidgetsAtHorizonGrid.slice(0, index)
          // 被检查的 widget 与之前任一个有相交，都要移除
          let needRemove = compareWidgets.some(widget => {
            let rect = widget.position
            let isCol = isLineCollision(checkWidgetRect.left, checkWidgetRect.width, rect.left, rect.width)
            return isCol
          })
          if (needRemove) {
            // 符合条件，移除
            findWidgetsAtHorizonGrid.splice(index, 1)
          }
        }
        return findWidgetsAtHorizonGrid
      },
      // 递归查找受影响的 widgets
      getDeepFollowing(sourceWidgets) {
        let returns = [].concat(sourceWidgets)
        let recursionFollowingWidgets = sourceWidgets => {
          sourceWidgets.forEach(upperWidget => {
            let followingWidgets = this.findFollowingWidgets(upperWidget)
            returns = returns.concat(followingWidgets)
            // 向下递归
            recursionFollowingWidgets(followingWidgets)
          })
        }
        recursionFollowingWidgets(sourceWidgets)
        return uniqueArray(returns)
      },
      getEndGrid() {
        if (this.widgetList.length === 0) {
          return 0
        }
        let bottoms = this.widgetList.map(item => item.position.top + item.position.height)
        return Math.max.apply(Math, bottoms) || 0
      },
      _resetHeight() {
        this.layout.height = this.getEndGrid() * this.layout.gridSize + 50
      },
      _addWidget({position = {}, data = {}} = {}) {
        let widgetData = new WidgetData()
        widgetData.setData(data)
        let widget = new Widget({
          position,
          layout: this.layout,
          data: widgetData
        })
        this.widgetList.push(widget)
        this._resetHeight()
      },
      deleteWidget(id, widget) {
        if (confirm('确定删除此卡片？')) {
          this._deleteWidget(id, widget)
        }
      },
      _deleteWidget(id, widget) {
        let index = -1
        for (let i = 0, total = this.widgetList.length; i < total; i++) {
          if (this.widgetList[i].id === id) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.widgetList.splice(index, 1)
          this.touchCeiling(this.widgetList)
          sortWidgetList(this.widgetList)
          this.widgetList.forEach(widget => {
            widget.applyOffset()
            widget.refresh(this.layout)
          })
          this._resetHeight()
        }
        // 通知图表数据发生了变化
        this._triggerChartChanged(-1, widget)
      },
      mockNewWidget() {
        let top = this.getEndGrid()
        this.excelStore.setValue('layoutTemporary', [{
          position: {
            width: 12,
            height: 6,
            top,
            left: 0
          },
          data: {
            id: uuid().replace(/-/ig, '_')
          }
        }])
      },
      _mockNewWidget () {
        this.excelStore.setValue('layoutTemporary', {
          chartId: '',
          modelId: '',
          title: '',
          chartType: ''
        })
      },
      // 获取最纯净的数据，用于保存
      parse() {
        // let widgets = this.widgetList.map(widget => widget.parse())
        let widgets = this.widgetList.map((widget) => {
          return CloneDeep(widget.parse())
        })

        let charts = CloneDeep(this.charts || [])
        //  删除卡片里的 model 数据 （老数据）
        if (widgets && widgets.length > 0) {
          for (let key of widgets) {
            delete key.data.model
          }
        }
        // 删除图表里的 model 数据
        if (charts && charts.length > 0) {
          for (let key of charts) {
            delete key.model
          }
        }
        return {
          widgets,
          charts,
          version: '1.0'
        }
      },
      refreshFilter () {
        if (this.$parent && this.$parent.$refs.globalFilterForm) {
          this.globalStyleSheet = {
            top: this.$parent.$refs.globalFilterForm.clientHeight+'px',
            height: `calc(100% - ${this.$parent.$refs.globalFilterForm.clientHeight}px)`
          }
        }
      }
    },
    watch: {
      widgets: {
        handler(widgetsListStr) {
          let widgetsList = JSON.parse(widgetsListStr)
          this.widgetList = []
          widgetsList.forEach(item => {
            this._addWidget(item)
          })
          // 通知图表数据发生了变化
          this._triggerChartChanged(true)
        },
        immediate: true
      },
      filters: {
        handler(val) {
          this.$nextTick(() => {
            if (val && val.length && this.showFilter) {
              this.globalStyleSheet = {
                top: this.$parent.$refs.globalFilterForm.clientHeight+'px',
                height: `calc(100% - ${this.$parent.$refs.globalFilterForm.clientHeight}px)`
              }
              this.timeInterval = setInterval(() => {
                if (this.count > 5) {
                  clearInterval(this.timeInterval)
                }
                this.count++
                if (val && val.length && this.showFilter) {
                  if (this.$parent && this.$parent.$refs.globalFilterForm) {
                    this.globalStyleSheet = {
                      top: this.$parent.$refs.globalFilterForm.clientHeight+'px',
                      height: `calc(100% - ${this.$parent.$refs.globalFilterForm.clientHeight}px)`
                    }
                  }
                } else {
                  this.globalStyleSheet = {}
                }
              }, 500)
            } else {
              this.globalStyleSheet = {}
            }
          })
        },
        deep: true,
        immediate: true
      }
    }
  }
  /**
   * 在本地进行文件保存
   * @param  {String} data     要保存到本地的图片数据
   * @param  {String} filename 文件名
   */
  function saveFile(data, filename) {
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
  }
</script>
