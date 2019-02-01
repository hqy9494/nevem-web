export default {
  initialState: {
    title: "统计",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StatisticsHome",
      getProps: ["rts"]
    }
  ]
};
