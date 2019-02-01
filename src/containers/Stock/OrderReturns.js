export default {
  initialState: {
    title: "退货单",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OrderReturns",
      getProps: ["rts"]
    }
  ]
};
