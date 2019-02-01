export default {
    initialState: {
      title: "角色管理详情",
      subtitle: "",
      breadcrumb: [{
	    name: '角色管理',
	    url: '/#/Setting/RoleManager'
	  }]
    },
    component: [
      {
        module: "RoleManagerDetail",
        getProps: ["rts"]
      }
    ]
  };
  