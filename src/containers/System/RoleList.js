export default {
  initialState: {
    title: "角色权限",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "RoleList",
      getProps: ["rts"]
    }
  ]
};
