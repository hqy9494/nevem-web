export default {
  initialState: {
    title: "缺货设备",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "EquipmentLose",
      getProps: ["rts"]
    }
  ]
};
