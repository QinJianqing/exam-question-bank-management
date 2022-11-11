<template>
  <div class="list">
    <div class="exam" v-for="(item, i) in list" :key="i">
      <div class="type">{{ i + 1 }}、{{ item.type }}</div>
      <div v-for="(exam, j) in item.list" :key="j">
        <div class="description">{{ j + 1 }}）{{ exam.description }}</div>
        <a-radio-group v-model:value="exam.value">
          <a-radio
            :style="radioStyle"
            :value="select_item.score"
            v-for="(select_item, k) in exam.list"
            :key="k"
            >{{ select_item.description }}</a-radio
          >
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExamList",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      radioStyle: {
        display: "flex",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.list {
  text-align: left;
}

.description {
  text-indent: 28px;
}

:deep(.ant-radio-group) {
  margin-left: 42px;
}
</style>