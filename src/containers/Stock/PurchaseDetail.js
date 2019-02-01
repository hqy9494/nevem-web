export default {
  initialState: {
    title: "采购退货",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PurchaseReturns",
      getProps: ["rts"]
    }
  ]
};
