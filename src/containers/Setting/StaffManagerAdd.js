export default {
  initialState: {
    title: "新建员工",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StaffManagerAdd",
      getProps: ["rts"]
    }
  ]
};
