export default {
  initialState: {
    title: "广告投放策略",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AdvertisingStrategyList",
      getProps: ["rts"]
    }
  ]
};
