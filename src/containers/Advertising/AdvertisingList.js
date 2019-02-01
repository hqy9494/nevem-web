export default {
  initialState: {
    title: "广告管理",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AdvertisingList",
      getProps: ["rts"]
    }
  ]
};
