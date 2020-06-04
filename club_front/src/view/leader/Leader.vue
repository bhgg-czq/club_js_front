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
                    <i class="el-icon-user-solid"></i>
                    <span>成员管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1" @click="getClubMember(1)">社团成员</el-menu-item>
                    <el-menu-item index="1-2" @click="getClubMember(0)">过往成员</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-s-management"></i>
                    <span>活动管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="3-1" @click="getActivity(1)">已审核</el-menu-item>
                    <el-menu-item index="3-2" @click="getActivity(0)">待审核</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <el-menu-item index="2" @click="toPassage">
                  <i class="el-icon-s-promotion"></i>
                  <span slot="title">推送发布</span>
                </el-menu-item>



              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <member-box v-if="choice == 1" :key="time" style="width: 100%"></member-box>
        <passage-box v-if="choice == 2" style="width: 100%"></passage-box>

        <activity-box v-if="choice == 3" :key="time" style="width: 100%" @my-check="getMyCheck"></activity-box>

        <progress-box v-if="choice == 4" :key="time" style="width: 100%"></progress-box>

      </el-container>
    </el-container>
  </div>
</template>

<script>

  import Member from '../../components/Member.vue'
  import Passage from "../../components/Passage.vue"
  import Activity from '../../components/Activity.vue'
  import Progress from '../../components/Progress.vue'

  export default {
    name:'Member',
    data() {
      return {
        //导入的组件，1为member，2为 passage，3为activity，默认为1
        choice:1,

        msg:'',

        time:''
      };
    },

    components: {
      'member-box':Member,
      'passage-box':Passage,
      'activity-box':Activity,
      'progress-box':Progress
    },

    created() {},

    methods: {
      //监听来自活动审核时的页面切换
      getMyCheck(msg){
        this.msg=msg
        localStorage.setItem('msg',this.msg)
        this.choice=4;
      },

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

      //获得活动的组件
      getActivity(st){
        localStorage.setItem('type',st)
        this.choice=3;
        this.time=new Date().getTime()
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
    min-height:615px ;
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
