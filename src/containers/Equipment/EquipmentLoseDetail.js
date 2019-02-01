export default {
  initialState: {
    title: "缺货设备详情",
    subtitle: "",
    breadcrumb: [
      {
        name: '缺货设备',
        url: '/#/Equipment/EquipmentLose'
      }
    ],
  },
  component: [
    {
      module: "EquipmentLoseDetail",
      getProps: ["rts"]
    }
  ]
};
