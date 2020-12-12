<template>
  <div id="app" class="customer">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-button type="info" @click="handleDownload">导出表格</el-button>
      <!-- <el-input
        v-model="tel"
        placeholder="请输入用户ID"
        clearable
        style="width: 180px; margin-left: 50px"
      /> -->
      <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable style="width: 180px" />
      <!-- <el-input
        v-model="tel"
        placeholder="请输入推荐人手机号"
        clearable
        style="width: 180px"
      /> -->
      <el-input v-model="listQuery.realName" placeholder="请输入用户姓名" clearable style="width: 180px"
        @keyup.enter.native="getList" />
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="all">总用户数：{{ this.tableData.length }}</div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="nickName" label="昵称" width="100" />
        <el-table-column align="center" prop="phone" label="注册手机号" width="130" />
        <el-table-column align="center" prop="parentId" label="推荐关系" />
        <el-table-column align="center" prop="aint" label="余额" width="200" />
        <el-table-column align="center" prop="realName" label="真实姓名" width="200" />
        <el-table-column align="center" prop="shopId.name" label="归属分管" width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.shopId.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="注册日期" width="200" />
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
            </el-button>
            <el-button size="mini" icon="el-icon-office-building" type="success" @click="getAddress(scope.row)">收货地址
            </el-button>
            <el-button size="mini" icon="el-icon-lock" type="warning" @click="getEditData(scope.row)">限制抢拍</el-button>
            <el-button size="mini" icon="el-icon-lock" type="warning" @click="delData(scope.row)">限制登录</el-button>
            <el-button size="mini" icon="el-icon-lock" type="warning" @click="getEditData(scope.row)">限制资金转出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <!-- 用户资料dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" placeholder="请输入手机号" style="width: 400px" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="推荐关系" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" placeholder="请输入推荐关系" style="width: 400px" />
        </el-form-item>
        <el-form-item label="余额" :label-width="formLabelWidth">
          <el-input maxlength="8" show-word-limit v-model="form.aint" placeholder="请输入余额" style="width: 400px" />
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" style="width: 400px" />
        </el-form-item>
        <el-form-item label="所属分管" :label-width="formLabelWidth">
          <el-select v-model="form.shopId.id" clearable placeholder="请选择">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收货地址弹出框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible1" border>
      <el-table :data="gridData">
        <el-table-column property="createTime" label="日期" width="150"></el-table-column>
        <el-table-column property="receiveName" label="姓名" width="200"></el-table-column>
        <el-table-column property="receivePhone" label="电话" width="200"></el-table-column>
        <el-table-column property="site" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    userList,
    userAdd,
    userUpdate,
    shopList,
    addressList,
    addressDelete,
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
        // 分页
        pictLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          realName: "",
          phone: "",
        },
        tel: "",
        name: "",
        tableData: [],
        tableData1: [],
        gridData: [],
        dialogFormVisible: false,
        dialogFormVisible1: false,
        formLabelWidth: "220px",
        title1: "",
        btnLoading: false,
        form: {
          nickName: "",
          phone: "",
          parentId: "",
          aint: "",
          realName: "",
          shopId: {
            id: "",
          },
        },
      };
    },
    created() {
      this.getList();
      this.getShopList();
    },
    methods: {
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
        shopList()
          .then((response) => {
            this.pictLoading = false;
            this.tableData1 = response.data.data;
          })
          .catch(() => {
            this.tableData1 = [];
          });
      },
      // 获取数据
      getList() {
        const params = {
          page: this.listQuery.page,
          size: this.listQuery.limit,
        };
        const params1 = {
          realName: this.listQuery.realName !== "" ? this.listQuery.realName : undefined,
          phone: this.listQuery.phone !== "" ? this.listQuery.phone : undefined,
        };
        userList(params, params1).then((res) => {
          this.tableData = res.data.data.currentList;
        });
      },

      // 新增用户
      addShop() {
        this.dialogFormVisible = true;
        this.form.id = "";
        this.form.nickName = "";
        this.form.phone = "";
        this.form.parentId = "";
        this.form.aint = "";
        this.form.realName = "";
        this.form.shopId.id = "";
        this.title1 = "新增用户";
      },

      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.id = data.id;
        this.form.nickName = data.nickName;
        this.form.phone = data.phone;
        this.form.parentId = data.parentId;
        this.form.aint = data.aint;
        this.form.realName = data.realName;
        this.form.shopId.id = data.shopId.id;
        this.title1 = "编辑用户";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          userUpdate(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "用户修改成功",
              });
              this.dialogFormVisible = false;
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        } else {
          userAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "用户添加成功",
              });
              this.dialogFormVisible = false;
              this.getList();
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
                this.getList();
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
            "客户管理"
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
