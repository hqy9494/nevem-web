export default {
  initialState: {
    title: "新建角色",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "RoleManagerAdd",
      getProps: ["rts"]
    }
  ]
};
