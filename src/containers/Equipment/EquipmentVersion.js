export default {
  initialState: {
    title: "设备版本",
    subtitle: "",
    breadcrumb: true,
  },
  component: [
    {
      module: "EquipmentVersion",
      getProps: ["rts"]
    }
  ]
};
