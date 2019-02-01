export default {
  initialState: {
    title: "场地管理详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '场地管理详情',
        url: '/#/Site/SiteManagement'
      }
    ]
  },
  component: [
    {
      module: "SiteManagementDetail",
      getProps: ["rts"]
    }
  ]
};
