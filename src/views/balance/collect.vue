<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-input v-model="listQuery.userId" placeholder="请输入会员ID" clearable style="width: 180px; margin-left: 50px" />
      <el-input v-model="listQuery.userPhone" placeholder="请输入会员手机" clearable style="width: 180px;" />
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="userId" label="操作用户ID" />
        <el-table-column align="center" prop="userPhone" label="用户手机" />
        <el-table-column align="center" prop="typeDesc" label="操作描述" />
        <el-table-column align="center" prop="count" label="操作数量" />
        <el-table-column align="center" prop="targetPhone" label="转账的用户目标账号" />
        <el-table-column align="center" prop="balance" label="操作后的余额" />
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column align="center" prop="shopName" label="所属会馆" />
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
  </div>
</template>

<script>
  import * as qiniu from "qiniu-js";
  import {
    detailList,
    detailAdd,
    detailUpdate1,
    detailDelete,
    uploadPath,
    shopList1,
  } from "@/api/api";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "Stafff",
    components: {
      Pagination
    },
    data() {
      return {
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          userId: "",
          userPhone: "",
        },
        options: [{
          value: '0',
          label: '展示'
        }, {
          value: '1',
          label: '不展示'
        }],
        value: '', //开始时间
        value1: '', //结束时间
        uploadData: {
          //上传携带的额外参数
          key: Date.parse(new Date()), //上传的文件名
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },

        btnLoading: false,
        uploadPath,
        pictLoading: true,
        name: "", // 会馆名称
        title1: "",
        // 表格数据
        tableData: [],
        tableData1: [],
        valueTableData1: '',
        dialogFormVisible: false,
        form: {
          name: "",
          photo: "",
          startTime: '',
          endTime: '',
          state: '',
          openExperience: '',
          openGreen: '',
          shopId: {
            id: "",
          },
        },
        formLabelWidth: "100px",
      };
    },
    created() {
      this.getShopList();
      this.getList();
    },
    methods: {
      // 文件上传
      uploadUrl: function (response) {
        this.form.photo = "http://gvcdn.molinmall.cn/" + response.key;
        // console.log(response.key);
      },
      checkFileSize: function (file) {
        if (file.size > 1048576) {
          this.$message.error(
            `${file.name}文件大于1024KB，请选择小于1024KB大小的图片`
          );
          return false;
        }
        return true;
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
      // 会馆筛选
      changeState(val) {
        // console.log(val)

        if (val === '') {
          this.tableData = this.tableDataAll
        } else if (val !== "") {
          this.tableData = this.tableDataAll.filter((el) => el.shopId.name === val)
        }
      },
      // 获取数据
      getList() {
        const params = {
          page: this.listQuery.page,
          size: this.listQuery.limit,
        };
        const params1 = {
          userId: this.listQuery.userId !== "" ? this.listQuery.userId : undefined,
          userPhone: this.listQuery.userPhone !== "" ? this.listQuery.userPhone : undefined,
        };
        detailList(params, params1)
          .then((response) => {
            this.pictLoading = false;
            this.tableData = response.data.data.currentList;
            this.tableDataAll = response.data.data.currentList;
            this.total = response.data.data.totalRecords
          })
          .catch(() => {
            this.tableData = [];
          });
      },
      // 新建
      addShop() {
        this.dialogFormVisible = true;
        this.form.name = "";
        this.form.id = "";
        this.form.photo = "";
        this.form.startTime = "";
        this.form.endTime = "";
        this.form.state = "";
        this.form.openExperience = "";
        this.form.openGreen = "";
        this.form.shopId.id = "";
        this.title1 = "新增场次";
      },
      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.name = data.name;
        this.form.id = data.id;
        this.form.photo = data.photo;
        this.form.startTime = data.startTime;
        this.form.endTime = data.endTime;
        this.form.state = data.state;
        this.form.openExperience = data.openExperience;
        this.form.openGreen = data.openGreen;
        this.form.shopId.id = data.shopId.id;
        this.title1 = "编辑场次";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          detailUpdate1(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "会馆修改成功",
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
          detailAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "会馆添加成功",
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
        this.$confirm("此操作将永久删除该会馆, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const params = {
              id: row.id,
            };
            detailDelete(params)
              .then((response) => {
                this.$notify.success({
                  title: "成功",
                  message: "会馆删除成功",
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

<style lang="less" scoped>
  @rem: 1920/100rem;

  #app {
    box-sizing: border-box;
    padding-left: 30 / @rem;
    padding-top: 30 / @rem;

    .tablee {
      margin-top: 20 / @rem;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    .avatar {
      width: 145px;
      height: 145px;
      display: block;
    }
  }

</style>
