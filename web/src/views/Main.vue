<template>
  <div class="main">
    <h1>
      <i class="iconfont main-colors" style="font-size: 40px;">&#xe631;</i>记账本
    </h1>
    <section>
      <div class="card-box">
        <qb-card type="inCome" :value="inCome"></qb-card>
        <qb-card type="outCome" :value="outCome"></qb-card>
        <qb-card type="allCome" :value="allCome"></qb-card>
      </div>
      <div class="pick">
        月份选择：
        <el-date-picker v-model="valueMonth" @change="handleTable" type="month" placeholder="选择月"></el-date-picker>
        <div class="addButoom">
          <el-button type="primary" @click="dialogFormVisible = true">添加账单</el-button>
          <el-dialog title="添加账单" :visible.sync="dialogFormVisible">
            <el-form label-width="120px" @submit.native.prevent="validateForm('form')" ref="form" :model="form" :rules="rules">
              <el-form-item label="类型:" prop="type">
                <el-radio v-model="form.type" label="1">收入</el-radio>
                <el-radio v-model="form.type" label="0">支出</el-radio>
              </el-form-item>
              <el-form-item label="时间:" prop="time">
                <el-date-picker v-model="form.time" type="date" value-format="timestamp" placeholder="选择时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="分类:" prop="category">
                <el-select v-model="form.category" placeholder="请选择账单分类">
                  <el-option v-for="item in categroyData" :key="item.name" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="金额:" prop="amount">
                <el-col :span="7">
                  <el-input v-model.number="form.amount" placeholder="请输入金额"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" native-type="submit">保 存</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
    </section>
    <el-table :data="showTableData" border style="width: 100%;margin-bottom: 40px">
      <el-table-column prop="type" :formatter="formatType" label="类型" width="180" sortable></el-table-column>
      <el-table-column prop="time" sortable :formatter="formatDate" label="时间"></el-table-column>
      <el-table-column prop="category" :formatter="formatCategory" sortable label="分类"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import Card from "@/components/Card.vue"
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
  @Component({
    name: "Main",
    components: {
      'qb-card': Card
    }
  })
  export default class Main extends Vue {
    /* -----------------属性------------------- */
    tableData: objAmount[] = [];
    showTableData: objAmount[] = [];
    categroyData: objCategory[] = [];
    valueMonth: string = "";
    dialogFormVisible: boolean = false;
    form: objAmount = {
      type: "1",
      time: '',
      category: "",
      amount: ""
    };
    rules: any = {
      type: [{ required: true, message: '账单类型不能为空', trigger: 'blur' }],
      time: [{ required: true, message: '账单时间不能为空', trigger: 'blur' }],
      category: [{ required: true, message: '账单分类不能为空', trigger: 'blur' }],
      amount: [{ required: true, message: '账单金额不能为空', trigger: 'blur' },{ type: 'number', message: '请输入正确账单金额'}],
    };
    /* -----------------计算属性------------------- */
    get inCome(): number {
      const inComeArr = this.showTableData.filter(v => v.type === "1");
      return inComeArr.reduce((pre, cur) => pre + parseInt(cur.amount), 0);
    }

    get outCome(): number {
      const outComeArr = this.showTableData.filter(v => v.type === "0");
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
    /* -----------------方法------------------- */
    handleTable(v: Date) {
      if (v === null) {
        return (this.showTableData = this.tableData);
      }
      const pickMonth =
        new Date(v).getMonth() + 1 < 10 ?
        "0" + (new Date(v).getMonth() + 1) :
        new Date(v).getMonth() + 1;
      const pickYear = new Date(v).getFullYear();
      const yearMon = `${pickYear}-${pickMonth}`;
      this.showTableData = this.tableData.filter(item => {
        return this.formatDate(item).indexOf(yearMon) !== -1;
      });
    }
    validateForm(form: any): void {
      let ref: any = this.$refs[form];
      ref.validate((valid: Boolean) => {
        if (valid) {
          this.addAmount();
        } else {
          return false;
        }
      });
    }

    async addAmount() {
      const res = await this.$http.post("bill", this.form)
      if (res.data === 'success') {
        this.$message.success('添加成功');
        this.fetchTableData()
        this.valueMonth = '';
        this.form = {
          type: "1",
          time: '',
          category: "",
          amount: ""
        }
      } else {
        this.$message.error(res.data);
      }
      this.dialogFormVisible = false;
    }
    /* -----------------获取属性------------------- */
    async fetchTableData() {
      const resTable = await this.$http.get("bills");
      this.tableData = resTable.data;
      this.showTableData = resTable.data;
    }

    async fetchCategoryData() {
      const resCategories = await this.$http.get("categories");
      this.categroyData = resCategories.data;
    }

    created() {
      this.fetchTableData();
      this.fetchCategoryData();
    }
    /* -----------------格式化------------------- */
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
      const mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      const dd =
        date.getDate() === 0 ?
        "01" :
        date.getDate() && date.getDate() < 10 ?
        "0" + date.getDate() :
        date.getDate();
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
    margin-bottom: 30px;
    overflow: hidden;
    font-size: 22px;
    color: #333;
  }

  .pick {
    position: relative;
    margin-bottom: 10px;
  }

  .addButoom {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>