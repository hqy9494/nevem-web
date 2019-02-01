export default {
  initialState: {
    title: "货道流水",
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
      module: "CargoFlow",
      getProps: ["rts"]
    }
  ]
};
