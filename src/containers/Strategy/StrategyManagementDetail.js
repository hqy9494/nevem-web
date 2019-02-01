export default {
  initialState: {
    title: "价格策略详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '价格策略管理',
        url: '/#/Strategy/StrategyManagement'
      }
    ]
  },
  component: [
    {
      module: "StrategyManagementDetail",
      getProps: ["rts"]
    }
  ]
};
