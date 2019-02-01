export default {
  initialState: {
    title: "新建运营商",
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
