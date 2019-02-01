export default {
  initialState: {
    title: "采购盘点",
    subtitle: "",
    breadcrumb: [
      {
        name: '采购盘点信息详情',
        url: '/#/Stock/PurchaseInventory'
      }
    ]
  },
  component: [
    {
      module: "PurchaseInventoryDetail",
      getProps: ["rts"]
    }
  ]
};
