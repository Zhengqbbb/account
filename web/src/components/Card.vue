<template>
  <div>
    <el-card class="card" :class="type">
      <div class="icon-box">
        <i class="iconfont" style="font-size: 70px;font-weight: 500;">&#xe65c;</i>
        <div class="money-box">
          {{typeWord}}:
          <div class="money">{{ value }}</div>
          ￥
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  @Component({})
  export default class Card extends Vue {
    @Prop({ default: '0' }) private value!: string;
    @Prop({ default: 'inCome' }) private type!: string;

    get typeWord(): string {
      return this.type === 'inCome' ? '收入' : this.type === 'outCome' ? '支出' : '总计';
    }
  }
</script>

<style lang="css" scoped>
  .card {
    float: left;
    width: 310px;
    height: 80px;
    position: relative;
  }

  .icon-box {
    width: 80px;
    color: #fff;
    height: 80px;
    position: absolute;
    top: 0%;
    left: 0%;
    border-radius: 4px 0 0 4px;
    text-align: center;
  }

  .inCome {
    background-color: #37bc9b;
  }

  .inCome .icon-box {
    background-color: #2b957a;
  }

  .outCome {
    margin: 0 38px;
    background-color: #ff902b;
  }

  .outCome .icon-box {
    background-color: #d65f00;
  }

  .allCome {
    background-color: #5d9cec;
  }

  .allCome .icon-box {
    background-color: #2f80e7;
  }

  .money-box {
    position: absolute;
    width: 229px;
    height: 80px;
    line-height: 80px;
    letter-spacing: 1px;
    text-align: center;
    top: 0;
    left: 80px;
  }

  .money {
    display: inline-block;
    width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    letter-spacing: 0px;
    text-align: center;
  }
</style>