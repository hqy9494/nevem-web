export default {
  initialState: {
    title: "类别管理",
    subtitle: "",
    breadcrumb: [
      {
        name: '行业管理',
        url: '/#/Site/IndustryManagement'
      }
    ]
  },
  component: [
    {
      module: "CategoryManagement",
      getProps: ["rts"]
    }
  ]
};

