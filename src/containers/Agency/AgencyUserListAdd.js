export default {
  initialState: {
    title: "新建用户",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AgencyUserListDetail",
      getProps: ["rts"]
    }
  ]
};
