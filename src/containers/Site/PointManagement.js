export default {
  initialState: {
    title: "点位管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PointManagement",
      getProps: ["rts"]
    }
  ]
};
