export default {
  initialState: {
    title: "场地商圈详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '场地商圈列表',
        url: '/#/Site/BusinessDistrict'
      }
    ]
  },
  component: [
    {
      module: "BusinessDistrictDetail",
      getProps: ["rts"]
    }
  ]
};
