export default {
  initialState: {
    title: "接口管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "ApiManager",
      getProps: ["rts"]
    }
  ]
};
