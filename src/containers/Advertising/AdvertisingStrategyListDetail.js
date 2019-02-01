export default {
  initialState: {
    title: "广告投放策略详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AdvertisingStrategyListDetail",
      getProps: ["rts"]
    }
  ]
};
