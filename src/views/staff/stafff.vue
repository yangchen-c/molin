<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-input v-model="listQuery.name" placeholder="请输入会馆名称" clearable style="width: 180px; margin-left: 50px" />
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="编号" width="50" />
        <el-table-column align="center" prop="userId" label="馆长ID" width="50" />
        <el-table-column align="center" prop="name" label="会馆名称" />
        <el-table-column align="center" prop="photo" label="会馆展示图">
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
        <!-- 新增数值 -->
        <el-table-column align="center" prop="priceAddPercent" label="转拍价格增幅百分比" />
        <el-table-column align="center" prop="rebatePercent" label="平台手续费百分比" />
        <el-table-column align="center" prop="experienceOrderLimit" label="新人体验每场抢单数量" />
        <el-table-column align="center" prop="newThreshold" label="新人入场门槛" />
        <el-table-column align="center" prop="newPunish" label="新人流派惩罚" />
        <el-table-column align="center" prop="newCompensate" label="新人流派补偿" />
        <el-table-column align="center" prop="oldThreshold" label="老人入场门槛" />
        <el-table-column align="center" prop="oldPunish" label="老人流派惩罚" />
        <el-table-column align="center" prop="oldCompensate" label="老人流派补偿" />
        <el-table-column align="center" prop="openExperience" label="新人体验">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.openExperience == '0'">关</el-tag>
            <el-tag type="success" v-if="scope.row.openExperience == '1'">开</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="experiencePhoto" label="新人体验顶部展示图">
          <template slot-scope="scope">
            <img :src="scope.row.experiencePhoto" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="openGreen" label="绿色通道">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.openGreen == '0'">关</el-tag>
            <el-tag type="success" v-if="scope.row.openGreen == '1'">开</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="greenPhoto" label="绿色通道顶部展示图">
          <template slot-scope="scope">
            <img :src="scope.row.greenPhoto" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="experienceHours" label="新人体验有效时长/小时" />
        <el-table-column align="center" prop="experienceAdvanceMin" label="新人体验提前入场时间/分钟" />
        <el-table-column align="center" prop="experienceApplyStartTime" label="申请体验开始时间" />
        <el-table-column align="center" prop="experienceApplyEndTime" label="申请体验结束时间" />
        <el-table-column align="center" prop="greenMax" label="通道最大人数" />
        <el-table-column align="center" prop="greenCurrent" label="当前场馆开启了通道的用户数量" />
        <el-table-column align="center" prop="greenPrice" label="通道价格" />
        <el-table-column align="center" prop="greenHours" label="通道时长" />
        <el-table-column align="center" prop="greenAdvanceMin" label="通道提前入场时间/分钟" />
        <el-table-column align="center" prop="greenApplyStartTime" label="申请通道开始时间" />
        <el-table-column align="center" prop="greenApplyEndTime" label="申请通道结束时间" />
        <!-- 新增end -->
        <el-table-column align="center" label="操作" fixed="right" width="200">
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
        <el-form-item label="会馆名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入会馆名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="馆长ID" :label-width="formLabelWidth">
          <el-input v-model="form.userId" placeholder="请输入馆长ID" style="width: 400px" />
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
        <el-form-item label="会馆排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" placeholder="请输入会馆排序" style="width: 400px" />
        </el-form-item>
        <el-form-item label="展示状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会馆展示图" :label-width="formLabelWidth">
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
        <el-form-item label="转拍价格增幅百分比" :label-width="formLabelWidth">
          <el-input v-model="form.priceAddPercent" placeholder="转拍价格增幅百分比" style="width: 400px" />
        </el-form-item>
        <el-form-item label="平台手续费百分比" :label-width="formLabelWidth">
          <el-input v-model="form.rebatePercent" placeholder="平台手续费百分比" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人体验每场抢单数量" :label-width="formLabelWidth">
          <el-input v-model="form.experienceOrderLimit" placeholder="新人体验每场抢单数量" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人入场门槛" :label-width="formLabelWidth">
          <el-input v-model="form.newThreshold" placeholder="新人入场门槛" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人流派惩罚" :label-width="formLabelWidth">
          <el-input v-model="form.newPunish" placeholder="新人流派惩罚" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人流派补偿" :label-width="formLabelWidth">
          <el-input v-model="form.newCompensate" placeholder="新人流派补偿" style="width: 400px" />
        </el-form-item>
        <el-form-item label="老人入场门槛" :label-width="formLabelWidth">
          <el-input v-model="form.oldThreshold" placeholder="老人入场门槛" style="width: 400px" />
        </el-form-item>
        <el-form-item label="老人流派惩罚" :label-width="formLabelWidth">
          <el-input v-model="form.oldPunish" placeholder="老人流派惩罚" style="width: 400px" />
        </el-form-item>
        <el-form-item label="老人流派补偿" :label-width="formLabelWidth">
          <el-input v-model="form.oldCompensate" placeholder="老人流派补偿" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人体验开关" :label-width="formLabelWidth">
          <el-switch v-model="form.openExperience" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="新人体验顶部展示图" :label-width="formLabelWidth">
          <el-upload :data="uploadData1" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl1"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.experiencePhoto" :src="form.experiencePhoto" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1024kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="绿色通道开关" :label-width="formLabelWidth">
          <el-switch v-model="form.openGreen" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="绿色通道顶部展示图" :label-width="formLabelWidth">
          <el-upload :data="uploadData2" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl2"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.greenPhoto" :src="form.greenPhoto" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1024kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="新人体验有效时长/小时" :label-width="formLabelWidth">
          <el-input v-model="form.experienceHours" placeholder="新人体验有效时长/小时" style="width: 400px" />
        </el-form-item>
        <el-form-item label="新人体验提前入场时间/分钟" :label-width="formLabelWidth">
          <el-input v-model="form.experienceAdvanceMin" placeholder="新人体验提前入场时间/分钟" style="width: 400px" />
        </el-form-item>
        <el-form-item label="申请体验开始时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.experienceApplyStartTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="申请体验结束时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.experienceApplyEndTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="通道最大人数" :label-width="formLabelWidth">
          <el-input v-model="form.greenMax" placeholder="通道最大人数" style="width: 400px" />
        </el-form-item>
        <el-form-item label="当前场馆开启了通道的用户数量" :label-width="formLabelWidth">
          <el-input v-model="form.greenCurrent" placeholder="当前场馆开启了通道的用户数量" style="width: 400px" />
        </el-form-item>
        <el-form-item label="通道价格" :label-width="formLabelWidth">
          <el-input v-model="form.greenPrice" placeholder="通道价格" style="width: 400px" />
        </el-form-item>
        <el-form-item label="通道时长" :label-width="formLabelWidth">
          <el-input v-model="form.oldCompensate" placeholder="通道时长" style="width: 400px" />
        </el-form-item>
        <el-form-item label="通道提前入场时间/分钟" :label-width="formLabelWidth">
          <el-input v-model="form.oldCompensate" placeholder="通道提前入场时间/分钟" style="width: 400px" />
        </el-form-item>
        <el-form-item label="申请通道开始时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.greenApplyStartTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="申请通道结束时间" :label-width="formLabelWidth">
          <el-time-picker v-model="form.greenApplyEndTime" value-format="HH:mm" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59'
            }" placeholder="任意时间点">
          </el-time-picker>
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
    shopList,
    shopAdd,
    shopUpdate,
    shopDelete,
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
        uploadData: {
          //上传携带的额外参数
          key: Date.parse(new Date()), //上传的文件名
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadData1: {
          key: Date.parse(new Date()) + 1,
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadData2: {
          key: Date.parse(new Date()) + 2,
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
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
          state: '',
          startTime: '',
          endTime: '',
          sort: '',
          userId: '',
          // 新增
          experienceOrderLimit:'',
          priceAddPercent: '',
          rebatePercent: '',
          newThreshold: '',
          newPunish: '',
          newCompensate: '',
          oldThreshold: '',
          oldPunish: '',
          oldCompensate: '',
          openExperience: '',
          experiencePhoto: '',
          openGreen: '',
          greenPhoto: '',
          experienceHours: '',
          experienceAdvanceMin: '',
          experienceApplyStartTime: '',
          experienceApplyEndTime: '',
          greenMax: '',
          greenCurrent: '',
          greenPrice: '',
          greenHours: '',
          greenAdvanceMin: '',
          greenApplyStartTime: '',
          greenApplyEndTime: '',
          // 新增end
        },
        formLabelWidth: "220px",
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 文件上传
      uploadUrl: function (response) {
        this.form.photo = "http://gvcdn.molinmall.cn/" + response.key;
      },
      uploadUrl1: function (response) {
        this.form.experiencePhoto = "http://gvcdn.molinmall.cn/" + response.key;
      },
      uploadUrl2: function (response) {
        this.form.greenPhoto = "http://gvcdn.molinmall.cn/" + response.key;
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
          // phone: this.listQuery.phone !== "" ? this.listQuery.phone : undefined,
        };
        shopList(params, params1)
          .then((response) => {
            // console.log(response.data.data)
            this.pictLoading = false;
            this.tableData = response.data.data.currentList;
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
        this.form.state = "";
        this.form.startTime = "";
        this.form.endTime = "";
        this.form.sort = "";
        this.form.userId = "";
        // 新增
        this.form.experienceOrderLimit = "";
        this.form.priceAddPercent = "";
        this.form.rebatePercent = "";
        this.form.newThreshold = "";
        this.form.newPunish = "";
        this.form.newCompensate = "";
        this.form.oldThreshold = "";
        this.form.oldPunish = "";
        this.form.oldCompensate = "";
        this.form.openExperience = "";
        this.form.experiencePhoto = "";
        this.form.openGreen = "";
        this.form.greenPhoto = "";
        this.form.experienceHours = "";
        this.form.experienceAdvanceMin = "";
        this.form.experienceApplyStartTime = "";
        this.form.experienceApplyEndTime = "";
        this.form.greenMax = "";
        this.form.greenCurrent = "";
        this.form.greenPrice = "";
        this.form.greenHours = "";
        this.form.greenAdvanceMin = "";
        this.form.greenApplyStartTime = "";
        this.form.greenApplyEndTime = "";
        // 新增end
        this.title1 = "新增会馆";
      },
      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.name = data.name;
        this.form.id = data.id;
        this.form.photo = data.photo;
        this.form.state = data.state;
        this.form.startTime = data.startTime;
        this.form.endTime = data.endTime;
        this.form.sort = data.sort;
        this.form.userId = data.userId;
        // 新增 
        this.form.experienceOrderLimit = data.experienceOrderLimit;
        this.form.priceAddPercent = data.priceAddPercent;
        this.form.rebatePercent = data.rebatePercent;
        this.form.newThreshold = data.newThreshold;
        this.form.newPunish = data.newPunish;
        this.form.newCompensate = data.newCompensate;
        this.form.oldThreshold = data.oldThreshold;
        this.form.oldPunish = data.oldPunish;
        this.form.oldCompensate = data.oldCompensate;
        this.form.openExperience = data.openExperience;
        this.form.experiencePhoto = data.experiencePhoto;
        this.form.openGreen = data.openGreen;
        this.form.greenPhoto = data.greenPhoto;
        this.form.experienceHours = data.experienceHours;
        this.form.experienceAdvanceMin = data.experienceAdvanceMin;
        this.form.experienceApplyStartTime = data.experienceApplyStartTime;
        this.form.experienceApplyEndTime = data.experienceApplyEndTime;
        this.form.greenMax = data.greenMax;
        this.form.greenCurrent = data.greenCurrent;
        this.form.greenPrice = data.greenPrice;
        this.form.greenHours = data.greenHours;
        this.form.greenAdvanceMin = data.greenAdvanceMin;
        this.form.greenApplyStartTime = data.greenApplyStartTime;
        this.form.greenApplyEndTime = data.greenApplyEndTime;
        // 新增end
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
