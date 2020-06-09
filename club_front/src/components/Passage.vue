<template>
  <div>
        <el-main style="height: 642px">
          <div class="search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item >
                <el-input style="width: 150px" v-model="formInline.keyStr" placeholder="搜索关键字" @input="keyup"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleAdd">发布推送</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="passageList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="_id" label="ID" width="55" v-if=false></el-table-column>
                <el-table-column prop="name" label="标题" width="180"></el-table-column>
                <el-table-column prop="content" label="内容介绍" width="350" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="url" label="推送链接" width="240" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="time" :formatter="renderTime" label="发布时间" width="180"></el-table-column>

                <el-table-column fixed="right" label="操作" width="180" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleRemove(scope.row._id)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>

          <!--分页器-->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total=total
              @current-change="ChangePage"
              :current-page=currentPage

              @size-change="ChangeSize"
              :page-size=pageSize
            >
            </el-pagination>
          </div>

          <!--发布内容弹出框-->
          <div class="dialogs">
            <el-dialog
              title="发布推送"
              :visible.sync="addDialogFormVisible"
              style="width:1000px; left:300px; top:100px"
            >
              <el-form :model="passage" ref="passage">

                <el-form-item label="标题：" :label-width="formLabelWidth">
                  <el-input
                    v-model="passage.name"
                    autocomplete="off"
                    placeholder="请输入标题"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="内容介绍：" :label-width="formLabelWidth" :show-overflow-tooltip="true">
                  <el-input
                    type="textarea"
                    v-model="passage.content"
                    autocomplete="off"
                    placeholder="请输入内容（100字内）"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="链接：" :label-width="formLabelWidth">
                  <el-input
                    v-model="passage.url"
                    autocomplete="off"
                    placeholder="请输入链接"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPassage">确 定</el-button>
              </div>
            </el-dialog>
          </div>

        </el-main>
  </div>
</template>

<script>
  export default {
    name:"Passage",
    data() {
      return {
        row: 0,

        passage: {
          name: "",
          content: "",
          url: ""
        },

        formLabelWidth: "100px",
        addDialogFormVisible: false,

        id: localStorage.getItem("id"),  //社团id
        passageList: [], //成员列表

        currentPage: 1, //当前页
        pageSize: 7,    //默认每页信息的数量
        total: 100,    //默认获得数量为100条

        //搜索栏
        formInline: {keyStr: ""},

      }
    },

    components: {},

    created() {
      this.getPassage();
    },

    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },

      keyup(){
        if (this.formInline.keyStr=="") {
          this.getPassage();
        }
      },

      //得到推送信息
      getPassage() {
        this.axios.get("http://localhost:3000/leader/passageAll?cid="+this.id).then(res => {
          this.formInline.keyStr="";
          console.log(res.data)
          if(res.data.code===200){
          this.passageList = res.data.passages;
          this.total=this.passageList.length;
          }
        });
      },

      //当前页面切换
      ChangePage: function(currentPage){
        this.currentPage = currentPage;
        this.getPassage();
      },
      //监听页面数量的改变
      ChangeSize:function(pageSize){
        this.pageSize=pageSize;
      },

      //发布推送
      handleAdd() {
        this.addDialogFormVisible = true;
      },

      addPassage:function(){
        var _this=this;
        if(this.passage.name == '' || this.passage.content == '' ||this.passage.url == '')
          this.$message({
            type: "info",
            message: "所填项不能为空！"
          });
        else if(this.passage.content.length>100)
          this.$message({
            type: "info",
            message: "推送内容不能超过100个字！"
          });
        else
          this.axios({
            method: "post",
            url: "http://localhost:3000/leader/addPassage",
            data: {
              cid: _this.id,
              name:_this.passage.name,
              content:_this.passage.content,
              url:_this.passage.url,
              img:null
            }
          }).then(res => {
            if(res.data.code===200){
              this.$message({
                type:'success',
                message: '发布成功！'
              });
              _this.addDialogFormVisible = false;
              _this.getPassage();
              _this.passage={};
            }else{
              this.$message.error("发布失败")
            }
          });
      },

      //删除推送
      handleRemove(pid) {
        this.$confirm("此操作将永久删除该条推送, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.axios.get("http://localhost:3000/leader/deletePassage?pid="+pid).then(res=>{
              console.log(res)
              if(res.data.code===200){
                this.getPassage();
                this.$message({
                  type: "info",
                  message: "删除成功！"
                });
              }
              else
                this.$message({
                  type: "info",
                  message: "删除失败！"
                });
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      },

      //根据用户输入关键次进行搜索
      handleSearch() {
        //console.log(this.formInline.keyStr);
        var keyword=this.formInline.keyStr;
        if(keyword=="")
          this.$message({
            type: "info",
            message: "搜索词不能为空!"
          });
        else{
          this.axios.get("http://localhost:3000/leader/searchPassage?cid="+this.id+"&keyStr="+keyword).then(res=>{
            if(res.data.code===200){
              this.currentPage=1;
              this.passageList=res.data.passages;
              this.total=this.passageList.length;
            }
          })
        }
      },

      getClubMember(st){
        localStorage.setItem('state',st)
        this.$router.replace({path: '/leader/member'})
      },

      onSubmit(row) {},

      //时间转换函数
      renderTime:function(row, column) {
        var date = new Date(row[column.property]).toJSON();
        if (date == undefined) {
          return "";
        }
        return new Date(+new Date(date) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },
    },

  };
</script>


<style scoped>
  .page{
    margin-top:30px;
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
