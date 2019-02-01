export default {
  initialState: {
    title: "收款账号",
    subtitle: "",
    breadcrumb: [{
      name: '收款账号',
      url: '/#/Account/CollectAccount'
    }]
  },
  component: [
    {
      module: "CollectManagement",
      getProps: ["rts"]
    }
  ]
};