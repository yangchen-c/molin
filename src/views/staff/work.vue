<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-input v-model="listQuery.name" placeholder="请输入场次名称" clearable style="width: 180px; margin-left: 50px" />
      <el-select v-model="valueTableData1" placeholder="请选择会馆" @change="changeState($event)" clearable>
        <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="编号" width="50" />
        <el-table-column align="center" prop="name" label="场次名称" />
        <el-table-column align="center" prop="photo" label="场次展示图">
          <template slot-scope="scope">
            <img :src="scope.row.photo" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间" />
        <el-table-column align="center" prop="endTime" label="结束时间" />
        <el-table-column align="center" prop="sort" label="排序" />
        <el-table-column align="center" prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">展示</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">不展示</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="openExperience" label="新人体验">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.openExperience == '0'">关</el-tag>
            <el-tag type="success" v-if="scope.row.openExperience == '1'">开</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="openGreen" label="绿色通道">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.openGreen == '0'">关</el-tag>
            <el-tag type="success" v-if="scope.row.openGreen == '1'">开</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shopId.name" label="所属会馆">
          <template slot-scope="scope">
            <el-tag>{{scope.row.shopId.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
            </el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <!-- dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="场次名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入场次名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.startTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.endTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="所属会馆" :label-width="formLabelWidth">
          <el-select v-model="form.shopId.id" clearable placeholder="请选择">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新人体验开关" :label-width="formLabelWidth">
          <el-switch v-model="form.openExperience" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="绿色通道开关" :label-width="formLabelWidth">
          <el-switch v-model="form.openGreen" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="场次展示图" :label-width="formLabelWidth">
          <!-- :headers="headers" -->
          <el-upload :data="uploadData" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.photo" :src="form.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1024kb
            </div>
          </el-upload>
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
  import * as qiniu from "qiniu-js";
  import {
    sessionList,
    sessionAdd,
    sessionUpdate,
    sessionDelete,
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
          name: "",
          // phone: "",
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
          name: this.listQuery.name !== "" ? this.listQuery.name : undefined,
          phone: this.listQuery.phone !== "" ? this.listQuery.phone : undefined,
        };
        sessionList(params, params1)
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
          sessionUpdate(this.form)
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
          sessionAdd(this.form)
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
            sessionDelete(params)
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
