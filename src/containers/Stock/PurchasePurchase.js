export default {
  initialState: {
    title: "采购进货",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PurchasePurchase",
      getProps: ["rts"]
    }
  ]
};
