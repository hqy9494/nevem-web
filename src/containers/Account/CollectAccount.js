export default {
  initialState: {
    title: "收款账号",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "CollectAccount",
      getProps: ["rts"]
    }
  ]
};