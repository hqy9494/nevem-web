export default {
  initialState: {
    title: "新建代理商",
    subtitle: "",
    breadcrumb: [
      {
        name: '代理商列表',
        url: '/#/Agency/AgencyList'
      }
    ]
  },
  component: [
    {
      module: "AgencyListDetail",
      getProps: ["rts"]
    }
  ]
};
