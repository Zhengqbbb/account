<template>
  <div class="main">
    <h1>
      <i class="iconfont main-colors" style="font-size: 40px;">&#xe631;</i
      >记账本
    </h1>
    <section>
      <div class="card-box">
        <el-card class="card income">
          <div class="icon-box">
            <i class="iconfont" style="font-size: 70px;font-weight: 500;"
              >&#xe65c;</i
            >
            <div class="money-box">
              收入:
              <div class="money">{{ inCome }}</div>
              ￥
            </div>
          </div>
        </el-card>
        <el-card class="card outcome">
          <div class="icon-box">
            <i class="iconfont" style="font-size: 70px;font-weight: 500;"
              >&#xe666;</i
            >
            <div class="money-box">
              支出:
              <div class="money">{{ outCome }}</div>
              ￥
            </div>
          </div>
        </el-card>
        <el-card class="card all">
          <div class="icon-box">
            <i class="iconfont" style="font-size: 70px;font-weight: 500;"
              >&#xe687;</i
            >
            <div class="money-box">
              总计:
              <div class="money">{{ allCome }}</div>
              ￥
            </div>
          </div>
        </el-card>
      </div>
    </section>
    <el-table :data="tableData" border style="width: 100%;margin-bottom: 40px">
      <el-table-column
        prop="type"
        :formatter="formatType"
        label="类型"
        width="180"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="time"
        :formatter="formatDate"
        label="时间"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="category"
        :formatter="formatCategory"
        sortable
        label="分类"
      >
      </el-table-column>
      <el-table-column prop="amount" label="金额"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
interface objAmount {
  type: string;
  time: string;
  category: string;
  amount: string;
}
interface objCategory {
  id: string;
  type: string;
  name: string;
}
@Component({})
export default class Main extends Vue {
  tableData: objAmount[] = [];
  categroyData: objCategory[] = [];

  get inCome(): number {
    const inComeArr = this.tableData.filter(v => v.type === "1");
    return inComeArr.reduce((pre, cur) => pre + parseInt(cur.amount), 0);
  }

  get outCome(): number {
    const outComeArr = this.tableData.filter(v => v.type === "0");
    return outComeArr.reduce((pre, cur) => {
      if (parseInt(cur.amount) > 0) {
        return pre + parseInt(cur.amount);
      } else {
        return pre - parseInt(cur.amount);
      }
    }, 0);
  }
  get allCome(): number {
    return this.inCome - this.outCome;
  }

  async fetchTableData() {
    const resTable = await this.$http.get("bills");
    this.tableData = resTable.data;
  }

  async fetchCategoryData() {
    const resCategories = await this.$http.get("categories");
    this.categroyData = resCategories.data;
  }

  created() {
    this.fetchTableData();
    this.fetchCategoryData();
  }
  formatType(row: objAmount) {
    return row.type === "1" ? "收入" : "支出";
  }
  formatCategory(row: objAmount) {
    if (this.categroyData.length !== 0) {
      return this.categroyData.filter(v => v.id === row.category)[0].name;
    }
  }
  formatDate(row: objAmount) {
    const date = new Date(parseInt(row.time));
    const yyyy = date.getFullYear();
    const mm = date.getMonth()< 10 ? "0" + date.getMonth() : date.getMonth();
    const dd = date.getDay() < 10 ? "0" + date.getDay() : date.getDay();
    return `${yyyy}-${mm}-${dd}`;
  }
}
</script>
<style lang="css" scoped>
h1 {
  height: 90px;
  line-height: 90px;
}
.main {
  width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: "PingFang SC", BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", "Microsoft YaHei", "微软雅黑", "黑体", "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", Arial, sans-serif;
  color: #333;
}
.el-table {
  font-size: 18px;
}
.main-colors {
  color: #ef3420;
}
.card-box {
  margin-bottom: 56px;
  overflow: hidden;
  font-size: 22px;
  color: #333;
}
.card {
  float: left;
  width: 310px;
  height: 80px;
  position: relative;
}
.card + .outcome {
  margin: 0 38px;
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
.income {
  background-color: #37bc9b;
}
.income .icon-box {
  background-color: #2b957a;
}
.outcome {
  background-color: #ff902b;
}
.outcome .icon-box {
  background-color: #d65f00;
}
.all {
  background-color: #5d9cec;
}
.all .icon-box {
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
.money-decrition {
  display: inline-block;
  width: 115px;
  white-space: wrap;
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
