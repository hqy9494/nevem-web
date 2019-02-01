export default {
  initialState: {
    title: "代理商用户列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AgencyUserList",
      getProps: ["rts"]
    }
  ]
};
