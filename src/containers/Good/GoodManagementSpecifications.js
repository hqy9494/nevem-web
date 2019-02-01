export default {
  initialState: {
    title: "规格管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "GoodManagementSpecifications",
      getProps: ["rts"]
    }
  ]
};
