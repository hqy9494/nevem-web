export default {
  initialState: {
    title: "仓库进货",
    subtitle: "",
    breadcrumb: [
      {
        name: '仓库进货',
        url: '/#/Stock/WarehousePurchase'
      }
    ]
  },
  component: [
    {
      module: "WarehousePurchaseDetail",
      getProps: ["rts"]
    }
  ]
};
