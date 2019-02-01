export default {
  initialState: {
    title: "库存调整列表",
    subtitle: "",
    breadcrumb: [
      {
        name: '库存调整',
        url: '/#/Equipment/StockAdjustment'
      }
    ],
  },
  component: [
    {
      module: "StockAdjustmentList",
      getProps: ["rts"]
    }
  ]
};
