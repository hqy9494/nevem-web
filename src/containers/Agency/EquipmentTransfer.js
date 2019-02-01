export default {
  initialState: {
    title: "设备转移",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentTransfer",
      getProps: ["rts"]
    }
  ]
};
