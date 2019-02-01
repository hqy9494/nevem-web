export default {
  initialState: {
    title: "行业管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "IndustryManagement",
      getProps: ["rts"]
    }
  ]
};

