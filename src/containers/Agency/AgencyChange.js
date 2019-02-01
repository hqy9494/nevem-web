export default {
  initialState: {
    title: "代理商切换",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AgencyChange",
      getProps: ["rts"]
    }
  ]
};
