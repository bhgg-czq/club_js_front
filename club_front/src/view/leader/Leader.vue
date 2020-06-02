<template>
  <div class="leader_warp">
    <el-container>
      <el-header height="100px">
        <h1>社团后台管理系统</h1>
      </el-header>

      <el-container>
        <el-aside width="166px">
          <el-row class="tac">
            <el-col>
              <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-user"></i>
                    <span>成员管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1" @click="getClubMember(1)">社团成员</el-menu-item>
                    <el-menu-item index="1-2" @click="getClubMember(0)">过往成员</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-menu-item index="2" @click="toPassage">
                  <i class="el-icon-s-promotion"></i>
                  <span slot="title">推送发布</span>
                </el-menu-item>

                <el-menu-item index="3">
                  <i class="el-icon-edit-outline"></i>
                  <span slot="title">活动申请</span>
                </el-menu-item>

                <el-menu-item index="4">
                  <i class="el-icon-s-order"></i>
                  <span slot="title">往期概览</span>
                </el-menu-item>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <member-box v-if="choice == 1" :key="time" style="width: 100%"></member-box>
        <passage-box v-if="choice == 2" style="width: 100%"></passage-box>

      </el-container>
    </el-container>
  </div>
</template>

<script>

  import  Member from '../../components/Member.vue'
  import Passage from "../../components/Passage.vue";

  export default {
    name:'Member',
    data() {
      return {
        choice:1,   //导入的组件，1为member，2为 passage，默认为1

        time:''
      };
    },

    components: {
      'member-box':Member,
      'passage-box':Passage
    },

    created() {},

    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },

      //获得成员表的组件
      getClubMember(st) {
        localStorage.setItem('state', st)
        this.choice=1;
        this.time=new Date().getTime()
      },

      //获得推送表的组件
      toPassage(){
        this.choice=2;
      },

      onSubmit(row) {}
    }
  };
</script>


<style scoped>
  .page{
    margin-top:50px;
    margin-left: 500px;
  }
  .el-header {
    background-color: #757e8a;
  }
  .el-aside{
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-col {
    border-radius: 4px;
    background-color: #D3DCE6;
  }
  .el-menu-item{
    background-color: #D3DCE6;
    text-align: left;
  }
  .el-main{
    background-color: #f2f2f2;
    /*min-height:615px;*/
  }
  img{
    margin: 30px 0;
  }
  h1{
    font-size: 40px;
    margin-top:20px;
    margin-left: 5px;
    color: #fff;
  }
</style>
