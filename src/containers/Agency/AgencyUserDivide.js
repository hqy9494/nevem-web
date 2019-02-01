export default {
  initialState: {
    title: "点位分成",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "AgencyUserDivide",
      getProps: ["rts"]
    }
  ]
};
