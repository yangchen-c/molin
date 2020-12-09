<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
    </div>
    <div class="tablee">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="pictLoading"
      >
        <el-table-column align="center" prop="id" label="编号" width="50" />
        <el-table-column align="center" prop="name" label="会馆名称" />
        <el-table-column align="center" prop="photo" label="会馆展示图" >
        <template slot-scope="scope">
            <img :src="scope.row.photo" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sortId" label="排序" />
        <el-table-column align="center" prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">展示</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">不展示</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-document-copy"
              type="primary"
              @click="getEditData(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="会馆名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            placeholder="请输入会馆名称"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="会馆展示图" :label-width="formLabelWidth">
          <!-- :headers="headers" -->
          <el-upload
            :data="uploadData"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadUrl"
            :before-upload="checkFileSize"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png"
          >
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
        <el-button type="primary" :loading="btnLoading" @click="addSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import {
  shopList,
  shopAdd,
  shopUpdate,
  shopDelete,
  uploadPath,
} from "@/api/api";

export default {
  name: "Stafff",
  data() {
    return {
      uploadData: {
        //上传携带的额外参数
        key: Date.parse(new Date()), //上传的文件名
        token:
          "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
      },

      btnLoading: false,
      uploadPath,
      pictLoading: true,
      name: "", // 会馆名称
      title1: "",
      // 表格数据
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: "",
        photo: "",
      },
      formLabelWidth: "100px",
    };
  },
  created() {
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
    // 获取数据
    getList() {
      shopList()
        .then((response) => {
          this.pictLoading = false;
          this.tableData = response.data.data;
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
      this.title1 = "新增会馆";
    },
    // 编辑
    getEditData(data) {
      this.dialogFormVisible = true;
      this.form.name = data.name;
      this.form.id = data.id;
      this.form.photo = data.photo;
      this.title1 = "编辑会馆";
    },
    // 编辑新增确定事件
    addSubmit() {
      // this.btnLoading = true
      if (this.form.id) {
        shopUpdate(this.form)
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
        shopAdd(this.form)
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
          shopDelete(params)
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
