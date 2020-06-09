<template>
  <div class="card">
    <template>
      <el-table :data="aList" border style="width: 100%" v-if="this.type==='activity'">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="items[0].name" label="社团名称" width="130" ></el-table-column>
        <el-table-column prop="name" label="活动名称" width="150" ></el-table-column>
        <el-table-column prop="detail" label="活动内容" :show-overflow-tooltip="true" width="180" ></el-table-column>
        <el-table-column prop="items[0].college" label="所属分院" width="120" ></el-table-column>
        <el-table-column prop="cName" label="申请地点" width="120"></el-table-column>
        <el-table-column prop="number" label="限定人数" width="90"></el-table-column>
        <el-table-column prop="time" label="活动时间" :show-overflow-tooltip="true" width="180" ></el-table-column>
        <el-table-column prop="isPass" label="活动状态" width="80"></el-table-column>

        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="rehandlePass(scope.row)" type="primary" size="mini">重新审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="aList" style="width: 100%" v-if="this.type==='class'">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="活动场地：">
                <span>{{ props.row.classroom[0].name }}</span>
              </el-form-item>
              <el-form-item label="活动时间：">
                <span>{{ props.row.time }}</span>
              </el-form-item>
              <el-form-item label="审批状态：">
                <span v-if="props.row.isPass=='审核未通过'" style="color: red">{{ props.row.isPass }}</span>
                <span v-else style="color: green">{{ props.row.isPass }}</span>
              </el-form-item>
              <el-form-item label="失败原因：">
                <span>{{ props.row.reason }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="社团名称" prop="clubname"></el-table-column>
        <el-table-column label="所属分院" prop="college"></el-table-column>
        <el-table-column label="活动名称" prop="activity[0].name"></el-table-column>
        <el-table-column label="活动内容" prop="activity[0].detail" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="人数" prop="activity[0].number"></el-table-column>
        <el-table-column label="预算" prop="activity[0].budget"></el-table-column>
      </el-table>

    </template>
  </div>
</template>

<script>
  export default {
    name: "AdminPass",
    data() {
      return {
        adminId:'1',//默认值为1
        activityId:'',
        aList:[],
        type:'',
      };
    },
    created() {
      this.$bus.$on('getalready',(data) =>{
        this.getAlreadyPassa()
      })
      this.adminId = localStorage.getItem("id")
      this.type = localStorage.getItem("type")
      console.log(this.adminId)//疑问这里不会有异步问题吗
      this.getAlreadyPassa()

    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //已审核列表
      getAlreadyPassa() {
        if(this.type==="activity"){
          this.axios.get("http://localhost:3000/admin/alreadypassa?aid="+this.adminId).then(res=>{
            if (res.data.code===200)
              this.aList = res.data.activities;
            for(var i = 0;i<this.aList.length;i++){
                if(this.aList[i].a_pass === true)
                  this.aList[i].isPass = '通过'
                else
                  this.aList[i].isPass = '未通过'
              this.aList[i].time = this.renderTime(this.aList[i].start_time)+"到"+this.renderTime(this.aList[i].end_time)
            }
          })
        }else{
          this.axios.get("http://localhost:3000/admin/alreadypassb?aid="+this.adminId).then(res=>{
            if (res.data.code===200)
              this.aList = res.data.activities;
            for(var i = 0;i<this.aList.length;i++) {
              if (this.aList[i].state === 0)
                this.aList[i].isPass = '审核未通过'
              else
                this.aList[i].isPass = '审核通过'
              this.aList[i].time = this.renderTime(this.aList[i].startTime) + " 到 " + this.renderTime(this.aList[i].endTime)
            }
          })
        }
      },

      //时间转换函数
      renderTime:function(d) {
        var date = new Date(d).toJSON();
        if (date == undefined) {
          return "";
        }
        return new Date(+new Date(date) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
