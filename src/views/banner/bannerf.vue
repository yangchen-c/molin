<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="编号" width="50" />
        <el-table-column align="center" prop="title" label="名称" />
        <el-table-column align="center" prop="photo" label="轮播图">
          <template slot-scope="scope">
            <img v-for="item in scope.row.photo.split(',')" :key="item.id" :src="item" alt
              style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">展示</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">不展示</el-tag>
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
          <el-input v-model="form.title" placeholder="请输入场次名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品轮播图" :label-width="formLabelWidth">
          <el-upload :data="uploadData" :action="uploadPath" :on-success="handleGalleryUrl1" :on-remove="handleRemove1"
            :before-upload="beforeUploadGetKey" multiple accept=".jpg, .jpeg, .png, .gif" list-type="picture-card"
            :file-list="form.banner1">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-upload :data="uploadData1" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl1"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.url" :src="form.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as qiniu from "qiniu-js";
  import {
    rotationList,
    rotationAdd,
    rotationUpdate,
    rotationDelete,
    uploadPath,
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
        },
        options: [{
          value: '0',
          label: '展示'
        }, {
          value: '1',
          label: '不展示'
        }],
        uploadData: {
          //上传携带的额外参数
          // key: Date.parse(new Date()), //上传的文件名
          key: '',
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadData1: {
          key: Date.parse(new Date()) + 1,
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadData2: {
          key: '',
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },

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
          id: '',
          title: "",
          photo: "",
          photo1: [],
          banner1: [],
          state: '',
          url: '',
        },
        formLabelWidth: "100px",
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 文件上传       
      // 列表图
      uploadUrl1: function (response) {
        this.form.url = "http://gvcdn.molinmall.cn/" + response.key;
      },
      // uploadUrl: function (response) {
      //   this.form.photo = "http://gvcdn.molinmall.cn/" + response.key;
      // },
      beforeUploadGetKey() { //每个文件上传之前 给它一个 名字
        this.uploadData.key = Date.parse(new Date());
      },
      beforeUploadGetKey2() { //每个文件上传之前 给它一个 名字
        this.uploadData2.key = Date.parse(new Date()) + 1;
      },
      // 详情图
      handleGalleryUrl2(res, file, fileList) {
        // console.log(res)
        const banner1 = "http://gvcdn.molinmall.cn/" + res.key;
        this.form.detail1.push(banner1)
        this.form.detail = this.form.detail1.join(',')

      },
      handleRemove2: function (file, fileList) {
        for (var i = 0; i < this.form.detail.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url
          if (file.response === undefined) {
            url = file.url
          } else {
            url = file.response.data.url
          }

          if (this.form.detail[i].url === url) {
            this.form.detail.splice(i, 1)
          }
        }
      },
      // 轮播图
      handleGalleryUrl1(res, file, fileList) {
        // console.log(res)
        const banner = "http://gvcdn.molinmall.cn/" + res.key;
        this.form.photo1.push(banner)
        this.form.photo = this.form.photo1.join(',')

      },
      handleRemove1: function (file, fileList) {
        for (var i = 0; i < this.form.photo.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url
          if (file.response === undefined) {
            url = file.url
          } else {
            url = file.response.data.url
          }

          if (this.form.photo[i].url === url) {
            this.form.photo.splice(i, 1)
          }
        }
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
        const params = {
          page: this.listQuery.page,
          size: this.listQuery.limit,
        };
        const params1 = {
          name: this.listQuery.name !== "" ? this.listQuery.name : undefined,
        };
        rotationList(params, params1)
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
        this.form.title = "";
        this.form.id = "";
        this.form.photo = "";
        this.form.state = "";
        this.form.url = "";
        this.title1 = "新增轮播图";
      },
      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.title = data.title;
        this.form.id = data.id;
        this.form.photo = data.photo;
        this.form.state = data.state;
        this.form.url = data.url;
        this.title1 = "编辑轮播图";
      },
      // 编辑新增确定事件
      addSubmit() {
        if (this.form.id) {
          rotationUpdate(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "轮播图修改成功",
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
          rotationAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "轮播图添加成功",
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
        this.$confirm("此操作将永久删除该轮播图, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const params = {
              id: row.id,
            };
            rotationDelete(params)
              .then((response) => {
                this.$notify.success({
                  title: "成功",
                  message: "轮播图删除成功",
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
