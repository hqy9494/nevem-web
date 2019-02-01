export default {
  initialState: {
    title: "订单支付",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OrderPay",
      getProps: ["rts"]
    }
  ]
};