export default {
  initialState: {
    title: "菜单管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "MenuManager",
      getProps: ["rts"]
    }
  ]
};
