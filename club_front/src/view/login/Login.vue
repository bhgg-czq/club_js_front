<template>
  <div :class="$style.main">
    <div :class="$style.parent">
      <div :class="$style.title">
        <p>用户登录</p>
      </div>
      <div :class="$style.message">
        <span :class="$style.span">学号/工号</span>
        <input type="text" v-model="loginForm.sno" placeholder="请输入学号或工号"/>
        <br><br>
        <span :class="$style.span">密码</span>
        <input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
        <br><br>
        <input id="type" type="checkbox">是否管理员
        <br><br>
        <button :class="$style.button1" v-on:click="login">登录</button>
        <button :class="$style.button2" v-on:click="login">XXX</button>
      </div>
    </div>
  </div>
</template>

<style module>
  .main{
    height: 300px;
    padding-top: 60px;
  }
  .parent{
    width:300px;
    height:300px;
    margin:auto;
    border:1px solid #BBBBBB;
    border-radius:8px;
    box-shadow: 3px 3px 2px #BBBBBB;
  }
  .title{
    border-radius:8px 8px 0px 0px;
    background-color: #66b1ff;
    width:100%;
    box-sizing: border-box;
    /*height:30px;*/
    color:white;
    padding-top:10px;
    padding-left:20px;
    padding-bottom: 10px;
    font-weight: bold;
  }
  .message{
    padding-top:30px;
    padding-left:20px;
    padding-right:20px;
    box-sizing: border-box;
    width:100%;
  }
  .span{
    display:inline-block;
    width:75px;
    margin:5px;
    margin-right:0px;
  }
  .button1{
    width:65px;
    border-color: #66b1ff;
    background-color: #66b1ff;
    border-radius: 2px;
    color:white;
    /*margin-top:30px;*/
    margin-left:35px;
  }
  .button2{
    width:65px;
    background-color: #BBBBBB;
    border-radius: 2px;
    color:white;
    margin-left: 50px;
  }
</style>
<script>

  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          sno: '',
          password: ''
        },
        isLeader:true
      }
    },
    methods: {
      login () {
        var input = document.getElementById("type")
        if(input.checked){
          this.isLeader = false;
        }
        if(this.isLeader){
          console.log("try")
          this.axios
            .post('http://localhost:8181/api/leader/login', {
              id: this.loginForm.sno,
              password: this.loginForm.password
            })
            .then(res => {
              if (res.data.code === 200) {
                localStorage.setItem("id",res.data.cId)
                console.log(localStorage.getItem("id"))
                this.$router.replace({path: '/leader/member'})
              }
              if(res.data.code === 300){
                console.log(300)
                this.$message({
                  type: "info",
                  message: "还没有获得权限哦！"
                });
              }
              if(res.data.code === 400){
                this.$message({
                  type: "info",
                  message: "密码错误！"
                });
                this.loginForm.password="";
              }
            })
            .catch(failResponse => {

            })
        }
        else {
          this.axios
            .post('http://localhost:8181/api/admin/login', {
              id: this.loginForm.sno,
              password: this.loginForm.password
            })
            .then(successResponse => {
              if (successResponse.data.code === 200) {
                localStorage.setItem("id",this.loginForm.sno)
                this.$router.replace({path: '/admin'})
              }
            })
            .catch(failResponse => {
            })
        }

      }
    }
  }
</script>
