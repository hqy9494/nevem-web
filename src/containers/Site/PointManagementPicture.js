export default {
  initialState: {
    title: "点位图片详情",
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
      module: "PointManagementPicture",
      getProps: ["rts"]
    }
  ]
};
