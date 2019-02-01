export default {
  initialState: {
    title: "订单列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OrderManagement",
      getProps: ["rts"]
    }
  ]
};
