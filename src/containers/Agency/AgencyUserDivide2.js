export default {
  initialState: {
    title: "点位分成",
    subtitle: "",
    breadcrumb: [{
        name: '代理商列表',
        url: '/#/Agency/AgencyList'
      }]
  },
  component: [
    {
      module: "AgencyUserDivide2",
      getProps: ["rts"]
    }
  ]
};
