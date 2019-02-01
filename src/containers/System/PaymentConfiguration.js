export default {
  initialState: {
    title: "支付配置",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PaymentConfiguration",
      getProps: ["rts"]
    }
  ]
};
