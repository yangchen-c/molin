<template>
  <div id="app" class="orderf">
    <div class="btn">
      <!-- <el-button type="primary" @click="addShop">新建</el-button> -->
      <el-button type="info" @click="handleDownload">导出表格</el-button>
      <el-input v-model="listQuery.buyUserId" placeholder="请输入买家ID" clearable style="width: 150px" />
      <el-input v-model="listQuery.buyUserPhone" placeholder="请输入买家手机号" clearable style="width: 180px" />
      <el-input v-model="listQuery.saleUserId" placeholder="请输入卖家ID" clearable style="width: 150px" />
      <el-input v-model="listQuery.saleUserPhone" placeholder="请输入卖家手机号" clearable style="width: 180px" />
      <el-input v-model="listQuery.goodHouseId" placeholder="请输入库号" clearable style="width: 180px" />
      <el-input v-model="listQuery.number" placeholder="请输入订单编号" clearable style="width: 180px" />
      <el-input v-model="listQuery.shopName" placeholder="请输入所属分管" clearable style="width: 180px" />
      <el-input v-model="listQuery.sessionName" placeholder="请输入所属场次" clearable style="width: 180px" />
      <el-select v-model="valueState" placeholder="请选择订单状态" @change="changeState($event)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getOrderList()">搜索</el-button>

    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <!-- <el-table-column align="center" prop="materialId" label="提货状态" width="150">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.materialId.id !== 0">已提货</el-tag>
            <el-tag type="danger" v-if="scope.row.materialId.id === 0">未提货</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column align="center" prop="materialId" label="订单状态" width="150">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state === 0">待付款</el-tag>
            <el-tag type="success" v-if="scope.row.state === 1">已付款</el-tag>
            <el-tag type="success" v-if="scope.row.state === 2">已完成/待转拍</el-tag>
            <el-tag type="danger" v-if="scope.row.state === 3">已取消</el-tag>
            <el-tag type="success" v-if="scope.row.state === 4">待发货</el-tag>
            <el-tag type="success" v-if="scope.row.state === 5">待收货</el-tag>
            <el-tag type="success" v-if="scope.row.state === 6">已收货</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="timeCount" label="倒计时">
          <template slot-scope="scope">
            <span v-if="scope.row.timeCount<0">00:00:00</span>
            <span v-if="scope.row.timeCount>0">{{scope.row.timeCount|capitalize}}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column align="center" prop="orderGoodId" label="商品信息" /> -->
        <el-table-column align="center" prop="saleUserId" label="卖家ID" />
        <el-table-column align="center" prop="saleUserName" label="卖家" />
        <el-table-column align="center" prop="saleUserPhone" label="卖家电话" />
        <el-table-column align="center" prop="buyUserId" label="买家ID" />
        <el-table-column align="center" prop="buyUserName" label="买家" />
        <el-table-column align="center" prop="buyUserPhone" label="买家电话" />
        <el-table-column align="center" prop="price" label="订单金额" width="200" />
        <el-table-column align="center" prop="paymentType" label="付款方式" width="150">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.paymentType === 1">支付宝</el-tag>
            <el-tag type="success" v-if="scope.row.paymentType === 2">微信</el-tag>
            <el-tag type="success" v-if="scope.row.paymentType === 3">银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="paymentVoucher" label="打款凭证" width="150">
          <el-popover placement="right" trigger="click" width="420" slot-scope="scope">
            <img :src="scope.row.paymentVoucher" :alt="scope.row.paymentVoucher" style="width: 400px;" />
            <img slot="reference" :src="scope.row.paymentVoucher" :alt="scope.row.paymentVoucher"
              style="max-height: auto;max-width: 50px;cursor: pointer;" />
          </el-popover>
        </el-table-column>
        <el-table-column align="center" prop="number" label="订单编号" width="200" />
        <el-table-column align="center" prop="createTime" label="下单时间" width="200" />
        <el-table-column align="center" prop="paymentTime" label="付款时间" width="200" />
        <el-table-column align="center" prop="turnTime" label="转拍时间" width="200" />
        <el-table-column align="center" prop="receiveTime" label="确认放货时间" width="200" />
        <el-table-column align="center" prop="goodId.houseId" label="库号" width="200" />
        <el-table-column align="center" prop="shopName" label="归属分馆" width="200">
          <!-- <template slot-scope="scope">
            <el-tag>{{scope.row.shopId.name}}</el-tag>
          </template> -->
        </el-table-column>
        <el-table-column align="center" prop="sessionName" label="所属场次" width="200" />
        <el-table-column align="center" prop="goodId.name" label="拍品标题" width="200" />
        <el-table-column align="center" label="操作" fixed="right" width="230">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state==1" size="mini" icon="el-icon-document-copy" type="primary"
              @click="back(scope.row)">取消返场
            </el-button>
            <el-button v-if="scope.row.state==4" size="mini" icon="el-icon-document-copy" type="primary"
              @click="backTake(scope.row)">取消提货
            </el-button>
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑货运
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <pagination v-if="flag" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" /> -->
      <!-- <pagination v-if="flag1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getOrderList" /> -->
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getOrderList" />
    </div>
    <!-- 用户资料dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="快递公司" :label-width="formLabelWidth">
          <el-input v-model="form.serviceCompany" placeholder="请输入快递公司" style="width: 400px" />
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth">
          <el-input v-model="form.serviceNumber" placeholder="请输入快递单号" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 取消返场弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisibleBack">
      <el-form :model="form2">
        <el-form-item label="请重新选择拍卖日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form2.auctionDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleBack = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    orderList,
    orderAdd,
    orderUpdate,
    shopList1,
    addressList,
    addressDelete,
    getOrderList,
    orderUpdate1,
    orderBack,
    takeBack,
    //测试
    ceshiList,
  } from "@/api/api";
  // import tableC from '@/components/Table/index'
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "Customer",

    components: {
      Pagination
    },
    data() {
      return {
        // 倒计时
        timer: '',
        countdown: [],
        timer1: 0,
        flag: true, //分页筛选显示
        flag1: false,
        valueState: '',
        options: [{
          value: 'state1',
          label: '全部订单'
        }, {
          value: 'state2',
          label: '待发货'
        }, {
          value: 'state3',
          label: '待付款'
        }, {
          value: 'state4',
          label: '已付款'
        }, {
          value: 'state5',
          label: '已完成/待转拍'
        }, {
          value: 'state6',
          label: '已取消'
        }, {
          value: 'state7',
          label: '待收货'
        }, {
          value: 'state8',
          label: '已收货'
        }, ],
        num: '100',
        value: '',
        // 分页
        pictLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          buyUserId: "",
          buyUserPhone: "",
          saleUserId: "",
          saleUserPhone: "",
          goodHouseId: "",
          number: "",
          shopName: "",
          sessionName: "",
        },
        tel: "",
        name: "",
        tableData: [],
        tableData1: [],
        gridData: [],
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisibleBack: false,
        formLabelWidth: "220px",
        title1: "",
        btnLoading: false,
        form: {
          // materialId: {
          id: '',
          serviceCompany: '',
          serviceNumber: ''
          // }
        },
        form2: {
          id: '',
          auctionDate: '',
        },
      };
    },
    created() {
      // this.getList();
      this.getOrderList()
      this.getShopList();
      // this.showTime()
    },
    // 倒计时过滤器
    filters: {
      capitalize: function (value) {
        var h = parseInt(value / 3600)
        var m = parseInt((value - 3600 * h) / 60)
        var s = (value - 3600 * h) - 60 * m

        var hh = h < 10 ? '0' + h : h
        var mm = m < 10 ? '0' + m : m
        var ss = s < 10 ? '0' + s : s
        return hh + ':' + mm + ':' + ss
      }
    },
    methods: {
      changeState(val) {
        // console.log(val)
        if (val === 'state2') {
          this.num = 4
          this.getOrderList()
        } else if (val === "state1") {
          this.num = 100
          // this.getList();
          this.getOrderList()
        } else if (val === 'state3') {
          this.num = 0
          this.getOrderList()
        } else if (val === 'state4') {
          this.num = 1
          this.getOrderList()
        } else if (val === 'state5') {
          this.num = 2
          this.getOrderList()
        } else if (val === 'state6') {
          this.num = 3
          this.getOrderList()
        } else if (val === 'state7') {
          this.num = 5
          this.getOrderList()
        } else if (val === 'state8') {
          this.num = 6
          this.getOrderList()
        }
      },
      // 定时器
      // showTime() {
      //   this.timer = setInterval(() => {
      //     this.getCeshi()
      //   }, 10);
      // },
      // 倒计时处理

      // 测试star--------------------------------------------
      // getCeshi() {
      //   ceshiList().then((res) => {
      //     console.log('杨琛真帅',res)
      //   }).catch(() => {
      //     console.log('小蓉是憨憨+笨蛋')
      //   })
      // },
      // 测试end--------------------------------------------

      // 获取收货地址
      getAddress(data) {
        const params = {
          id: data.id
        }
        // console.log(data.id)
        this.dialogFormVisible1 = true;
        addressList(params).then((res) => {
          this.gridData = res.data.data
          // console.log(res.data.data)
        })

      },
      // 获取会馆数据
      getShopList() {
        shopList1()
          .then((response) => {
            this.pictLoading = false;
            this.tableData1 = response.data.data;
          })
          .catch(() => {
            this.tableData1 = [];
          });
      },
      // 获取数据
      // getList() {
      //   const params = {
      //     page: this.listQuery.page,
      //     size: this.listQuery.limit,
      //   };
      //   const params1 = {
      //     realName: this.listQuery.realName !== "" ? this.listQuery.realName : undefined,
      //     phone: this.listQuery.phone !== "" ? this.listQuery.phone : undefined,
      //   };
      //   orderList(params, params1).then((res) => {
      //     this.tableData = res.data.data.currentList;
      //     this.total = res.data.data.totalRecords
      //   });
      // },
      // 获取提货数据
      getOrderList() {
        const params = { 
          page: this.listQuery.page,
          size: this.listQuery.limit,
          num: this.num
        };
        const params1 = {
          buyUserId: this.listQuery.buyUserId !== "" ? this.listQuery.buyUserId : undefined,
          buyUserPhone: this.listQuery.buyUserPhone !== "" ? this.listQuery.buyUserPhone : undefined,
          saleUserId: this.listQuery.saleUserId !== "" ? this.listQuery.saleUserId : undefined,
          saleUserPhone: this.listQuery.saleUserPhone !== "" ? this.listQuery.saleUserPhone : undefined,
          goodHouseId: this.listQuery.goodHouseId !== "" ? this.listQuery.goodHouseId : undefined,
          number: this.listQuery.number !== "" ? this.listQuery.number : undefined,
          shopName: this.listQuery.shopName !== "" ? this.listQuery.shopName : undefined,
          sessionName: this.listQuery.sessionName !== "" ? this.listQuery.sessionName : undefined,
        };
        getOrderList(params, params1).then((res) => {
          this.tableData = res.data.data.currentList;
          this.total = res.data.data.totalRecords
          // this.countdown = res.data.data.currentList
        });
      },

      // 新增用户
      addShop() {
        this.dialogFormVisible = true;
        this.form.id = "";
        this.form.nickName = "";
        this.form.phone = "";
        this.title1 = "新增用户";
      },


      // 取消返场
      back(data) {
        this.dialogFormVisibleBack = true;
        this.form2.id = data.id;
        this.title1 = "取消返场";
      },
      backSubmit() {
        if (this.form2.id) {
          orderBack(this.form2)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "货运修改成功",
              });
              this.dialogFormVisibleBack = false;
              // this.getList();
              this.getOrderList()
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        }
      },

      // 取消提货
      backTake(data) {
        // console.log(data.id)
        this.$confirm('此操作将取消提货, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            // takeBack({
            //     orderId: data.id
            //   })
            const params = {
              orderId: data.id
            }
            const params1 = {

            }
            takeBack(params, params1)
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '取消成功'
                })
                this.getOrderList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消提货'
            })
          })
      },

      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        // this.form.id = data.id;
        this.form.id = data.id;
        this.form.serviceCompany = data.serviceCompany;
        this.form.serviceNumber = data.serviceNumber;
        this.title1 = "编辑货运";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          orderUpdate1(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "货运修改成功",
              });
              this.dialogFormVisible = false;
              // this.getList();
              this.getOrderList()
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        } else {
          orderAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "货运添加成功",
              });
              this.dialogFormVisible = false;
              // this.getList();
              this.getOrderList()
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        }
      },
      // 删除
      delData(row) {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const params = {
              id: row.id,
            };
            customerDelete(params)
              .then((response) => {
                this.$notify.success({
                  title: "成功",
                  message: "记录删除成功",
                });
                // this.getList();
                this.getOrderList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.message,
                });
              });
          })
          .catch(() => {
            this.$notify.error({
              title: "取消",
              message: "已取消删除",
            });
          });
      },
      // 导出表格
      handleDownload() {
        //   this.downloadLoading = true
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "ID",
            "名称",
            "联系电话",
            "家庭住址",
            "门店",
            "订单金额",
            "交付日期",
          ];
          const filterVal = [
            "id",
            "name",
            "phone",
            "address",
            "store.name",
            "payment",
            "deliveryTime",
          ];
          excel.export_json_to_excel2(
            tHeader,
            this.tableData,
            filterVal,
            "买单卖单"
          );
          this.downloadLoading = false;
        });
      },
    },
  };

</script>

<style lang="less">
  .customer {
    .el-button+.el-button {
      margin-left: 0 !important;
      margin-top: 5px;
    }
  }

</style>


<style lang="less" scoped>
  @rem: 1920/100rem;

  #app {
    box-sizing: border-box;
    padding-left: 30 / @rem;
    padding-top: 30 / @rem;

    .tablee {
      margin-top: 20 / @rem;
    }

    .all {
      margin-top: 20 / @rem;
      font-weight: 700;
    }
  }

</style>
