export default {
  initialState: {
    title: "新建广告投放策略",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AdvertisingStrategyListAdd",
      getProps: ["rts"]
    }
  ]
};
