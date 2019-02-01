export default {
  initialState: {
    title: "申请退款",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "ApplyRefund",
      getProps: ["rts"]
    }
  ]
};
