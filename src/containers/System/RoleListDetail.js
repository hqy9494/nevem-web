export default {
  initialState: {
    title: "角色权限编辑",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "RoleListDetail",
      getProps: ["rts"]
    }
  ]
};
