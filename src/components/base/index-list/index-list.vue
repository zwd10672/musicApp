<template>
 <scroll class="index-list">
   <ul>
     <li class="group" v-for="group in data" :key="group.title">
       <h2 class="title">{{group.title}}</h2>
       <ul>
         <li class="item" v-for="item in group.list"
            :key="item.id">
           <img v-lazy="item.pic" class="avator" alt="">
           <span class="name">{{item.name}}</span>
         </li>
       </ul>
     </li>
   </ul>
   <div class="fixed">
     <div class=fixed-title> {{fixedTitle}} </div>
   </div>
 </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll/use-scroll.js'
export default {
  name: 'index-list',
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lange="scss" scoped>
  .index-list{
    position: relative;
    width: 100%;
    height: 100%;
    /* overflow: scroll; */
    overflow: hidden;
    background: $color-background;
    .group {
      padding-bottom:30px;
      .title {
        height:30px;
        padding-left:15px;
        line-height: 30px;
        font-size: 12px;
        color:rgba(255,255,255,0.5);
        background: #333;
        }
        .item {
          display:flex;
          align-items:center;
          padding:20px 0 0 20px;
          .avator {
             width: 50px;
             height: 50px;
             border-radius: 50%;
          }
          .name {
            margin-left: 20px;
            color: rgba(255,255,255,0.5);
            font-size: 14px;
          }
        }
    }
    .fixed{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
    }
    .fixed-title {
      height: 30px;
      line-height:30px;
      padding-left: 20px;
      font-size:12px;
      color:rgba(255,255,255,0.5);
      background:#333
    }
  }
</style>
