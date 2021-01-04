<template>
  <div id="app" class="customer">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable style="width: 180px" />
      <el-input v-model="listQuery.realName" placeholder="请输入用户姓名" clearable style="width: 180px"
        @keyup.enter.native="getList" />
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="all">总用户数：{{ this.tableData.length }}</div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="desc" label="代金券标题" width="100" />
        <el-table-column align="center" prop="price" label="代金券价值" />
        <el-table-column align="center" label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
            </el-button>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    powerList,
    powerAdd,
    powerUpdate,
    powerDelete,
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
          id: "",
          realName: "",
          phone: "",
        },
        tel: "",
        name: "",
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: "220px",
        title1: "",
        btnLoading: false,
        form: {
          nickName: "",
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
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
       powerList(params1).then((res) => {
          this.pictLoading = false;
          this.tableData = res.data.data.currentList;
          this.total = res.data.data.totalRecords
        });
      },

      // 新增用户
      addShop() {
        this.dialogFormVisible = true;
        this.form.id = "";
        this.title1 = "新增用户";
      },

      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.id = data.id;
        this.title1 = "编辑用户";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          powerUpdate(this.form)
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
          powerAdd(this.form)
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
            powerDelete(params)
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
