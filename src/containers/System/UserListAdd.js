export default {
  initialState: {
    title: "新建用户",
    subtitle: "",
    breadcrumb: [
      {
        name: '用户管理',
        url: '/#/System/UserList'
      }
    ]
  },
  component: [
    {
      module: "UserListDetail",
      getProps: ["rts"]
    }
  ]
};
