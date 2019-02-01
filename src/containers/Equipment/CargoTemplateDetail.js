export default {
  initialState: {
    title: "货道模板详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '货道模板',
        url: '/#/Equipment/CargoTemplate'
      }
    ]
  },
  component: [
    {
      module: "CargoTemplateDetail",
      getProps: ["rts"]
    }
  ]
};
