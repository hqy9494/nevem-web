export default {
  initialState: {
    title: "库存调整审核",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockAdjustmentCensor",
      getProps: ["rts"]
    }
  ]
};
