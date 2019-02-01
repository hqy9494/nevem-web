export default {
  initialState: {
    title: "场地管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "SiteManagement",
      getProps: ["rts"]
    }
  ]
};
