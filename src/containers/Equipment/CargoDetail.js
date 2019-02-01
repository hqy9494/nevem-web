export default {
  initialState: {
    title: "查看货道",
    subtitle: "",
    breadcrumb: [
      {
        name: '设备管理',
        url: '/#/Equipment/EquipmentManagement'
      }
    ]
  },
  component: [
    {
      module: "CargoDetail",
      getProps: ["rts"]
    }
  ]
};
