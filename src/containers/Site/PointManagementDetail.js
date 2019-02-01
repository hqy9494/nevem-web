export default {
  initialState: {
    title: "点位管理详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '点位管理',
        url: '/#/Site/PointManagement'
      }
    ]
  },
  component: [
    {
      module: "PointManagementDetail",
      getProps: ["rts"]
    }
  ]
};
