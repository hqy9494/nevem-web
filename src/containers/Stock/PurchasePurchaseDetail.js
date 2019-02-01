export default {
  initialState: {
    title: "采购进货",
    subtitle: "",
    breadcrumb: [
      {
        name: '采购进货信息详情',
        url: '/#/Stock/PurchasePurchase'
      }
    ]
  },
  component: [
    {
      module: "PurchasePurchaseDetail",
      getProps: ["rts"]
    }
  ]
};
