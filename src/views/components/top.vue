<template>
  <a-form>
    <div class="top">
      <a-form-item label="题目类型" name="type">
        <a-input v-model:value="formState.type" />
      </a-form-item>
      <a-form-item label="题目描述" name="description">
        <a-input v-model:value="formState.description" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" class="search" @click="search()"
          >查询</a-button
        >
        <a-button type="primary" @click="create()">创建题目</a-button>
      </a-form-item>
    </div>
  </a-form>
</template>

<script>
export default {
  name: "Top",
  data() {
    return {
      formState: {
        type: "",
        description: "",
      },
    };
  },
  methods: {
    search() {
      this.$emit("search", this.formState);
    },
    create() {
      this.$emit("create");
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .search {
    margin-right: 12px;
  }
}
</style>