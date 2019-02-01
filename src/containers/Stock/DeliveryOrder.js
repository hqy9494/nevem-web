export default {
  initialState: {
    title: "提货单",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "DeliveryOrder",
      getProps: ["rts"]
    }
  ]
};
