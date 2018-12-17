<style lang="stylus" rel="stylesheet/stylus">
html,body 
  position relative
  background #eee
  overflow hidden
*
  margin 0
  padding 0
.outer
  position relative
  height 100vh;
  top 0
  left 0
.toolBar
  position relative
  height 40px;
  background #fff
  a
    line-height 40px
    text-decoration none
    font-size 14px
    color #aaa
    &:hover
      text-decoration underline
.pager
  position relative
  width 960px
  height calc(100% - 40px)
  margin 0 auto
a.button
  display inline-block
  width 100px
  height 40px
  background #fafaff
  border 1px solid #ccc
  border-radius 4px
  line-height 40px
  font-size 14px
  text-align center
  text-decoration none
  color #333
  &:hover
    background #ccc
.container
  width 940px
  margin 0 auto
</style>
<template>
  <div class="outer">
    <div class="toolBar">
      <div class="container">
        <a href="javascript:void(0)" @click="save">保存</a>
      </div>
    </div>
    <div class="pager">
      <dashLayoutEditor
        ref="editor"
        :widgets="JSON.stringify(layout.widgets)"
        :charts.sync="layout.charts"
      >
        <template slot="widget" slot-scope="scope">
        </template>
      </dashLayoutEditor>
    </div>
  </div>
</template>

<script>
  import dashLayoutEditor from './dashboard/layout-editor.vue'

  export default {
    components: {
      dashLayoutEditor
    },
    name: 'BChartWrapper',
    data() {
      return {
        layout: {
          widgets: [{"position":{"width":12,"height":3,"top":0,"left":0},"data":{"widgetType":"pure-chart","title":"销售部2018年总业绩","chartList":[""],"chartTitleList":[],"activeTabIndex":0,"description":""}},{"position":{"width":4,"height":8,"top":3,"left":0},"data":{"widgetType":"column-charts","title":"市场部营销总额","chartList":["","",""],"chartTitleList":[],"activeTabIndex":0,"description":""}},{"position":{"width":8,"height":4,"top":3,"left":4},"data":{"widgetType":"tab-charts","title":"APP市场占有率","chartList":["","",""],"chartTitleList":["蜀山区","政务区","滨湖新区"],"activeTabIndex":2,"description":""}},{"position":{"width":8,"height":4,"top":7,"left":4},"data":{"widgetType":"pure-chart","title":"教育业务接入比例","chartList":[""],"chartTitleList":[],"activeTabIndex":0,"description":"2018年计划接入应用与实际接入情况对比，数据每周更新一次，数据来自多个部门，请注意处理好数据筛选与整理。"}},{"position":{"width":12,"height":4,"top":11,"left":0},"data":{"widgetType":"row-charts","title":"预算池","chartList":["","",""],"chartTitleList":[],"activeTabIndex":0,"description":""}}],
          charts: []
        }
      }
    },
    mounted() {
    
    },
    beforeDestroy () {
    },
    methods: {
      save () {
        let data = this.$refs.editor.parse()
        console.log('当前 dashboard 数据为：')
        console.log('_____________________')
        console.log(data)
        alert('请打开控制台查看数据')
      }

    }
  }
</script>