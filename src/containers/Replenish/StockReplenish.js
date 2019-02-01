export default {
  initialState: {
    title: "库存列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockReplenish",
      getProps: ["rts"]
    }
  ]
};
