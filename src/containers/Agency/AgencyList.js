export default {
  initialState: {
    title: "代理商列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AgencyList",
      getProps: ["rts"]
    }
  ]
};
