export default {
  initialState: {
    title: "价格策略管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StrategyManagement",
      getProps: ["rts"]
    }
  ]
};
