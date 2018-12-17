<style lang="stylus" rel="stylesheet/stylus" scoped>
  .chart-item-drag-area
    position relative
    top 1px
    height calc(100% - 2px)
    margin 0 2px
    outline 1px dashed #c2ced6
    text-align center
    line-height 80px
    font-size 13px
    color #c2ced6
    &.drag-over
      background #f7fafc
</style>
<template>
  <div
    :class="['chart-item-drag-area', isDragEnter ? 'drag-over' : '']"
    @drop="handleChartDragover"
    @dragenter="handleChartEnter"
    @dragleave="handleChartLeave"
    @dragover.stop.prevent>
    拖拽图表到此处
  </div>
</template>
<script>

  export default {
    name: 'widget-chart-for-drag',
    props: {
      widgetID: {},
      chartIndex: {}
    },
    data() {
      return {
        isDragEnter: false
      }
    },
    methods: {
      // 处理拖放事件
      handleChartEnter(event){
        this.isDragEnter = true
      },
      handleChartLeave(event){
        this.isDragEnter = false
      },
      handleChartDragover(event){
        this.isDragEnter = false
        // 获取图表数据 FIXME 容错处理
        let chartString = event.dataTransfer.getData('chart');
        let {id} = JSON.parse(chartString)
        this.$emit('chartInsert', {
          widgetID: this.widgetID,
          chartIndex: this.chartIndex,
          chartUUID: id
        })
      },
    }
  }
</script>
