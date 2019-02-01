export default {
  initialState: {
    title: "商品管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "GoodManagement",
      getProps: ["rts"]
    }
  ]
};
