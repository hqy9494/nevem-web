export default {
  initialState: {
    title: "用户管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "UserList",
      getProps: ["rts"]
    }
  ]
};
