export default {
  initialState: {
    title: "采购退货",
    subtitle: "",
    breadcrumb: [
      {
        name: '采购退货信息详情',
        url: '/#/Stock/PurchaseReturns'
      }
    ]
  },
  component: [
    {
      module: "PurchaseReturnsDetail",
      getProps: ["rts"]
    }
  ]
};
