export default {
  initialState: {
    title: "用户反馈",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "CustomerFeedback",
      getProps: ["rts"]
    }
  ]
};
