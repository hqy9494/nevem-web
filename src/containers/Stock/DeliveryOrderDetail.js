export default {
  initialState: {
    title: "提货单详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "DeliveryOrderDetail",
      getProps: ["rts"]
    }
  ]
};
