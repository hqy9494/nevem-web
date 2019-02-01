export default {
  initialState: {
    title: "运营商列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "OperatorList",
      getProps: ["rts"]
    }
  ]
};
