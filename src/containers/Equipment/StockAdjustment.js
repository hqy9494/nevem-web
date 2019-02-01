export default {
  initialState: {
    title: "库存调整",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockAdjustment",
      getProps: ["rts"]
    }
  ]
};
