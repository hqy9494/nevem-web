export default {
  initialState: {
    title: "配置信息详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '配置信息',
        url: '/#/Equipment/EquipmentInfo'
      }
    ]
  },
  component: [
    {
      module: "EquipmentInfoDetail",
      getProps: ["rts"]
    }
  ]
};
