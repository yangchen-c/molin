<template>
  <div class="login-container">
    <!-- 背景粒子 -->
    <vue-particles color="#fff" :particleOpacity="0.3" :particlesNumber="60" shapeType="circle" :particleSize="4"
      linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.3" :linesDistance="150" :moveSpeed="10"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi">
    </vue-particles>
    <transition name="el-zoom-in-center">
      <div class="card" v-show="show1">
        <transition name="el-zoom-in-center">
          <div class="logo" v-show="show2">
            <div class="zhLogo">
              <img src="../../assets/login/logo.png" alt="" />
            </div>
          </div>
        </transition>
        <div>
          <!-- 登录表单 -->
          <el-collapse-transition>
            <div v-show="show3">
              <div class="form1">
                <div class="text">系统登录</div>
                <div class="login-input">
                  <el-form v-if="flag" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
                    auto-complete="off" label-position="left">
                    <!-- <div class="title-container">
                      <h3 class="title">管理员登录</h3>
                    </div> -->
                    <el-form-item prop="username">
                      <span class="svg-container">
                        <svg-icon icon-class="user" />
                      </span>
                      <el-input v-model="loginForm.username" name="username" type="text" tabindex="1"
                        auto-complete="off" placeholder="管理员账户" />
                    </el-form-item>

                    <el-form-item prop="password">
                      <span class="svg-container">
                        <svg-icon icon-class="password" />
                      </span>
                      <el-input v-model="loginForm.password" :type="passwordType" name="password" auto-complete="off"
                        tabindex="2" show-password placeholder="管理员密码" @keyup.enter.native="handleLogin" />
                    </el-form-item>

                    <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
                      @click.native.prevent="handleLogin">登录</el-button>
                  </el-form>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </transition>
    <!-- <div class="copyright">
      <p>Copyright © 2020 xxx.com 版权所有 <a href="http://www.example.com/">沪ICP备xxx号</a></p>
      <p>
        技术支持 <a href="http://www.shidaiyx.com/">时代赢信网络科技有限公司</a>
      </p>
    </div> -->
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("管理员密码长度应大于6"));
        } else {
          callback();
        }
      };
      return {
        flag: true,
        show1: false,
        show2: false,
        show3: false,
        timer: "",
        loginForm: {
          username: "18632169197",
          password: "123456",
        },
        loginRules: {
          username: [{
            required: true,
            message: "管理员账户不允许为空",
            trigger: "blur"
          }, ],
          password: [{
              required: true,
              message: "管理员密码不允许为空",
              trigger: "blur"
            },
            {
              validator: validatePassword,
              trigger: "blur"
            },
          ],
        },
        passwordType: "password",
        loading: false,
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true,
      },
    },
    created() {
      this.showLogin();
      this.showLogo();
      this.showCard();
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      showCard() {
        this.timer = setTimeout(() => {
          this.show1 = true;
        }, 500);
      },
      showLogin() {
        this.timer = setTimeout(() => {
          this.show3 = true;
        }, 1000);
      },
      showLogo() {
        this.timer = setTimeout(() => {
          this.show2 = true;
        }, 1500);
      },
      // handleLogin() {
      //   console.log('111')
      //   this.$router.push('/customer')
      // },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid && !this.loading) {
            this.loading = true;
            this.$store
              .dispatch("LoginByUsername", this.loginForm)
              .then(() => {
                this.loading = false;
                this.$router.push({
                  path: this.redirect || "/"
                });
              })
              .catch((response) => {
                this.$notify.error({
                  title: "失败",
                  message: response.errMsg,
                });
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      },
    },
  };

</script>

<style lang="scss">
  $bg: #f2f2f2;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      // color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 60px;
      // width: 100%;
      width: 300px;

      input {
        background: transparent;
        border: 0px;
        padding-left: 30px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 0px 12px 35px;
        // color: $light_gray;
        height: 60px;
        // caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-button--medium {
      margin-top: 20px;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #f7f7f7;
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    // background-color: $bg;
    // overflow: hidden;
    background-image: url("../../assets/login/loginBg.gif");
    background-size: 100% 100%;
    position: relative;

    .card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(255, 255, 255, 0.1);
      // width: 520px;
      // max-width: 100%;
      width: 1492px;
      height: 698px;

      .logo {
        float: left;

        .zhLogo {
          margin-left: 226px;
          margin-top: 243px;
          width: 479px;
          height: 231px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .form1 {
        height: 698px;
        width: 524px;
        background-color: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        padding-top: 160px;
        // padding-left: 62px;
        // padding-right: 62px;
        float: right;
        position: relative;

        .text {
          text-align: center;
          font-size: 35px;
          color: #3da1ff;
          font-weight: 600;
        }

        .login-input {
          margin-top: 70px;

          .login-form {
            .txt-container {
              color: #889aa4;
              display: inline-block;
              margin-left: 10px;
            }
          }

          // 二维码登录样式
          .ewm1 {
            width: 220px;
            height: 220px;
            text-align: center;
            margin: 0 auto;

            img {
              width: 100%;
              height: 100%;
            }

            span {
              font-size: 16px;
              font-family: PingFang SC;
              color: #3886e1;
              line-height: 60px;
            }
          }
        }

        .fun {
          text-align: center;
          margin-top: 79px;
          position: absolute;
          top: 75%;
          left: 50%;
          transform: translate(-50%, -50%);

          .fun1 {
            cursor: pointer;

            img {
              display: inline-block;
              vertical-align: middle;
            }

            span {
              display: inline-block;
              margin-left: 10px;
              vertical-align: middle;
              color: #3886e1;
            }
          }

          .fun2 {
            cursor: pointer;

            span {
              display: inline-block;
              color: #3886e1;
              margin-top: 30px;
            }
          }
        }
      }
    }

    .login-form {
      // position: relative;
      position: absolute;
      width: 520px;
      max-width: 100%;
      padding-left: 35px;
      padding-right: 35px;
      margin: 0 auto;
      overflow: hidden;
    }

    // .tips {
    //   font-size: 14px;
    //   color: #fff;
    //   margin-bottom: 10px;

    //   span {
    //     &:first-of-type {
    //       margin-right: 16px;
    //     }
    //   }
    // }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    // .title-container {
    //   position: relative;

    //   .title {
    //     font-size: 26px;
    //     color: $light_gray;
    //     margin: 0px auto 40px auto;
    //     text-align: center;
    //     font-weight: bold;
    //   }
    // }
    // .copyright {
    //   font-size: 12px;
    //   color: #fff;
    //   position: absolute;
    //   bottom: 0;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   margin-bottom: 20px;
    //   letter-spacing: 0.6px;
    //   p {
    //     text-align: center;
    //     a {
    //       font-weight: bold;
    //       border-bottom: 1px solid #fff;
    //       font-family: "PingFangSC-Semibold", sans-serif;
    //     }
    //   }
    // }
  }

</style>
