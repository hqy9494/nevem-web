export default {
  initialState: {
    title: "代理商详情",
    subtitle: "",
    breadcrumb: [{
        name: '代理商列表',
        url: '/#/Agency/AgencyList'
      }]
  },
  component: [
    {
      module: "AgencyListDetail",
      getProps: ["rts"]
    }
  ]
};
