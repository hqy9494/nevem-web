export default {
  initialState: {
    title: "退货单详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OrderReturnsDetail",
      getProps: ["rts"]
    }
  ]
};
