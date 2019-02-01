export default {
  initialState: {
    title: "补货列表详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '库存列表',
        url: '/#/Replenish/StockReplenish'
      }
    ]
  },
  component: [
    {
      module: "StockReplenishDetail",
      getProps: ["rts"]
    }
  ]
};
