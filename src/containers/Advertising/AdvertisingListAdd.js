export default {
  initialState: {
    title: "广告管理详情",
    subtitle: "",
    breadcrumb: [{
        name: '广告管理',
        url: '/#/Advertising/AdvertisingList'
      }]
  },
  component: [
    {
      module: "AdvertisingListAdd",
      getProps: ["rts"]
    }
  ]
};
