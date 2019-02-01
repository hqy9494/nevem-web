export default {
  initialState: {
    title: "设备状态",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentStatus",
      getProps: ["rts"]
    }
  ]
};
