export default {
  initialState: {
    title: "收款订单",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "CollectOrder",
      getProps: ["rts"]
    }
  ]
};