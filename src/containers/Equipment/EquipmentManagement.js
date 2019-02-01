export default {
  initialState: {
    title: "设备管理",
    subtitle: "",
    breadcrumb: true,
  },
  component: [
    {
      module: "EquipmentManagement",
      getProps: ["rts"]
    }
  ]
};
