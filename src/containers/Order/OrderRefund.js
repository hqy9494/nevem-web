export default {
  initialState: {
    title: "退款订单列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OrderRefund",
      getProps: ["rts"]
    }
  ]
};
