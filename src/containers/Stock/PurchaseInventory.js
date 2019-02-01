export default {
  initialState: {
    title: "采购盘点",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PurchaseInventory",
      getProps: ["rts"]
    }
  ]
};
