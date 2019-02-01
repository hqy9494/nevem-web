export default {
  initialState: {
    title: "用户详情",
    subtitle: "",
    breadcrumb:  [{
        name: '用户列表',
        url: '/#/Agency/AgencyUserList'
      }]
  },
  component: [
    {
      module: "AgencyUserListDetail",
      getProps: ["rts"]
    }
  ]
};
