export default {
  initialState: {
    title: "员工管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StaffManager",
      getProps: ["rts"]
    }
  ]
};
