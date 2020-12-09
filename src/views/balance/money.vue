<template>
  <div id="app">
    <div class="btn">总收入：{{ this.AllMoney }}元</div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="store.name" label="门店" />
        <el-table-column align="center" prop="customerId.combo.name" label="套系分类" />
        <el-table-column align="center" prop="customerId.combo.classify.name" label="套系" />
        <el-table-column align="center" prop="payment" label="金额" />
        <el-table-column align="center" prop="createTime" label="时间" />
        <el-table-column align="center" prop="customerId.customerConsultant.name" label="客户顾问" />
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  orderList
  // orderAdd,
  // orderUpdate,
  // orderDelete,
} from '@/api/api'
import { getToken } from '@/utils/auth'

export default {
  name: 'Order',
  data() {
    return {
      AllMoney: '',
      // 表格数据
      tableData: []
    }
  },
  computed: {
    headers() {
      return {
        token: getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取数据
    getList() {
      orderList({ state: 1 })
        .then((response) => {
          this.tableData = response.data.data
          var sum = 0
          this.tableData.forEach(item => {
            sum = sum + Number(item.payment)
          })
          this.AllMoney = sum
        })
        .catch(() => {
          this.tableData = []
        })
    }
  }
}
</script>

<style lang="less" scoped>
@rem: 1920/100rem;
#app {
  box-sizing: border-box;
  padding-left: 30 / @rem;
  padding-top: 30 / @rem;
  .money {
    span {
      margin-right: 50 / @rem;
    }
  }
  .btn {
    margin-top: 20 / @rem;
  }
  .tablee {
    margin-top: 20 / @rem;
  }
}
</style>
