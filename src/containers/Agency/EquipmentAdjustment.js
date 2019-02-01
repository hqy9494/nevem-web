export default {
  initialState: {
    title: "设备调整",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentAdjustment",
      getProps: ["rts"]
    }
  ]
};
