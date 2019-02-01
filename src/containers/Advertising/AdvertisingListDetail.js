export default {
  initialState: {
    title: "广告管理详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AdvertisingListDetail",
      getProps: ["rts"]
    }
  ]
};
