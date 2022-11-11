<template>
  <div class="warp">
    <Search @search="search" @create="create" />

    <a-spin size="small" tip="保存中..." :spinning="saveLoading">
      <a-form v-show="showCreate">
        <a-form-item label="题目ID号" name="id">
          <a-input v-model:value="formState.id" />
        </a-form-item>
        <a-form-item label="题目类型" name="type">
          <a-input v-model:value="formState.type" />
        </a-form-item>
        <a-form-item label="题目描述" name="description">
          <a-textarea v-model:value="formState.description" :rows="4" />
        </a-form-item>
        <a-form-item label="选项" name="list">
          <div class="item" v-for="(item, i) in formState.list" :key="i">
            <a-tag>分值</a-tag>
            <a-input class="score" v-model:value="item.score" />
            <a-input class="description" v-model:value="item.description" />
            <a-button
              type="primary"
              danger
              @click="delSelectItem(i)"
              >删除</a-button
            >
          </div>
          <a-button
            block
            type="primary"
            class="btn-add"
            @click="addSelectItem()"
            >添加选项</a-button
          >
        </a-form-item>

        <a-form-item>
          <a-button type="primary" class="btn-save" @click="save()"
            >保存</a-button
          >
          <a-button class="btn-cancle" @click="cancle()">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>

    <a-spin size="small" tip="查询中..." :spinning="listLoading">
      <ExamList :list="examList" />
    </a-spin>
  </div>
</template>

<script>
import Search from "./components/search.vue";
import ExamList from "./components/examList.vue";
import { message } from 'ant-design-vue';

export default {
  components: {
    Search,
    ExamList,
  },
  data() {
    return {
      formState: {
        id: "",
        type: "",
        description: "",
        list: [{ score: "", description: "" }],
      },
      examList: [],
      showCreate: false,
      saveLoading: false,
      listLoading: false,
    };
  },
  methods: {
    initList() {
      console.log("调用<题目查询>接口，获取所有题目列表数据...");
      this.examList = [ // 接口返回的数据
        {
          type: "变革创新",
          list: [
            {
              id: "1",
              description:
                "有危机意识，能够敏锐地发现组织、项目中存在问题和潜在风险。",
              list: [
                { score: "20分", description: "A、卓越" },
                { score: "16分", description: "B、优秀" },
                { score: "12分", description: "C、良好" },
                { score: "8分", description: "D、一般" },
              ],
              value: "",
            },
          ],
        },
      ];
    },
    search(e) {
      this.listLoading = true;
      console.log("传参", e);
      console.log("调用<题目查询>接口..."); // 把 e 发送给后端
      // 响应成功
      console.log("更新examList，vue自动更新视图");
      setTimeout(() => {
        // 延迟0.5秒是接口0.5秒响应成功后，前端需要做的操作
        this.listLoading = false;
      }, 500);
    },
    create() {
      this.showCreate = true;
    },
    delSelectItem(i) {
      if (this.formState.list.length == 1) {
        message.warning('至少保留一项！');
      } else {
        this.formState.list.splice(i, 1);
      }
    },
    addSelectItem() {
      this.formState.list.push({
        score: "",
        description: "",
      });
    },
    save() {
      this.saveLoading = true;
      console.log("传参", this.formState);
      console.log("调用<题目保存>接口..."); // 把 formState 发送给后端
      console.log("调用<题目查询>接口，获取所有题目列表数据...");
      // 响应成功
      console.log("更新examList，vue自动更新视图");
      setTimeout(() => {
        // 延迟0.5秒是接口0.5秒响应成功后，前端需要做的操作
        this.saveLoading = false;
        this.formState = {
          id: "",
          type: "",
          description: "",
          list: [{ score: "", description: "" }],
        };
        this.showCreate = false;
      }, 500);
    },
    cancle() {
      this.formState = {
        id: "",
        type: "",
        description: "",
        list: [{ score: "", description: "" }],
      };
      this.showCreate = false;
    },
  },
  created() {
    this.initList();
  }
};
</script>

<style lang="less" scoped>
@tagHeight: 32px;

.warp {
  width: 40%;
  margin: 10px auto;

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    :deep(.ant-tag) {
      height: @tagHeight;
      line-height: @tagHeight;
    }

    .score {
      width: 15%;
    }

    .description {
      width: 40%;
    }

    :deep(.ant-input) {
      margin-right: 8px;
    }
  }

  .btn-add {
    background: var(--ant-success-color-active);
    border-color: var(--ant-success-color-active);
  }

  .btn-save {
    margin-right: 12px;
  }
}
</style>