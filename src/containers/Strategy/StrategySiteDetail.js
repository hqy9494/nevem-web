export default {
  initialState: {
    title: "场地管理详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '场地管理详情',
        url: '/#/Strategy/StrategySite'
      }
    ]
  },
  component: [
    {
      module: "StrategySiteDetail",
      getProps: ["rts"]
    }
  ]
};
