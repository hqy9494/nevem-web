export default {
  initialState: {
    title: "策略列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StrategyList",
      getProps: ["rts"]
    }
  ]
};