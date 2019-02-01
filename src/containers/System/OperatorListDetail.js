export default {
  initialState: {
    title: "运营商详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '运营商列表',
        url: '/#/System/OperatorList'
      }
    ]
  },
  component: [
    {
      module: "OperatorListDetail",
      getProps: ["rts"]
    }
  ]
};
