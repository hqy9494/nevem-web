export default {
  initialState: {
    title: "用户详情",
    subtitle: "",
    breadcrumb: [{
        name: '用户管理',
        url: '/#/System/UserList'
      }]
  },
  component: [
    {
      module: "UserListDetail",
      getProps: ["rts"]
    }
  ]
};
