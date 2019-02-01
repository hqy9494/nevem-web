export default {
  initialState: {
    title: "角色管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "RoleManager",
      getProps: ["rts"]
    }
  ]
};
