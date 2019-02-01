export default {
  initialState: {
    title: "员工详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StaffManagerDetail",
      getProps: ["rts"]
    }
  ]
};
