export default {
  initialState: {
    title: "接口详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "ApiManagerDetail",
      getProps: ["rts"]
    }
  ]
};
