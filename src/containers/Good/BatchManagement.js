export default {
  initialState: {
    title: "批次管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "BatchManagement",
      getProps: ["rts"]
    }
  ]
};
