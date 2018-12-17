<style lang="stylus" rel="stylesheet/stylus" scoped>
  .widget-type-select-area
    position relative
    height 100%
    text-align center
    overflow auto
    
  .list
    display flex
    justify-content space-around
    flex-flow: wrap;
    width 80%
    max-width 500px
    margin 40px auto 40px
  .item
    position relative
    width 80px
    height 100px
    border 1px solid #ccc
    border-radius 4px
    overflow hidden
    text-align center
    background #fff
    transition .2s
    transform-origin 50% 80%
    cursor pointer
    .cover
      height 60px
      line-height 60px
      background #f6f6f6
      font-size 12px
      color #ccc
    .title
      line-height 40px
      font-size 12px
      color #333
    &.active
      border-color #46a0df
      transform scale(1.2)
      z-index 2
  .button-area
    margin 0 0 20px
</style>
<template>
  <div class="widget-type-select-area">
    <div class="list">
      <div
        v-for="item in typeList"
        :key="item.name"
        :class="['item', item.name === selectedtype ? 'active' : '']"
        @click="selectedtype = item.name"
      >
        <div class="cover">示例图</div>
        <div class="title">{{item.title}}</div>
      </div>
    </div>
    <div class="button-area">
      <a href="javascript:void(0)" class="button" @click="selectWidgetType">选择布局</a>
    </div>
  </div>
</template>
<script>
  /**
   * WidgetType
   *  none：尚未定义
   *  pure-chart：单图表
   *  row-charts：横向并列图表
   *  column-charts：竖向并列图表
   *  tab-charts：tab页
   **/
  export default {
    name: 'widgetTypeSelector',
    props: {
      widgetID: {}
    },
    data() {
      return {
        typeList: [
          {
            name: 'pure-chart',
            title: '单图表'
          },
          {
            name: 'row-charts',
            title: '横排图表'
          },
          {
            name: 'column-charts',
            title: '竖排图表'
          },
          {
            name: 'tab-charts',
            title: 'tab图表'
          }
        ],
        selectedtype: ''
      }
    },
    mounted() {
      this.selectedtype = this.typeList[0].name
    },
    beforeDestroy() {
    },
    methods: {
      selectWidgetType(){
        this.$emit('typeSelected', {
          widgetID: this.widgetID,
          type: this.selectedtype
        })
      }
    }
  }
</script>
