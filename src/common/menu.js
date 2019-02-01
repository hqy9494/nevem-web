const menu = [
  {
    id: "Equipment",
    icon: "tablet",
    name: "设备",
    component: "Equipment",
    children: [
      {
        id: "EquipmentManagement",
        name: "设备管理",
        component: "EquipmentManagement"
      },
      {
        id: "EquipmentStatus",
        name: "设备状态",
        component: "EquipmentStatus"
      },
      {
        id: "EquipmentInfo",
        name: "配置信息",
        component: "EquipmentInfo"
      },
      {
        id: "EquipmentLose",
        name: "缺货设备",
        component: "EquipmentLose"
      },
      {
        id: "CargoTemplate",
        name: "货道模板",
        component: "CargoTemplate"
      },
      {
        id: "EquipmentFailure",
        name: "故障管理",
        component: "EquipmentFailure"
      },
      {
        id: "CargoFlow",
        name: "货道流水",
        component: "CargoFlow"
      }
    ]
  },
  {
    id: "Good",
    icon: "profile",
    name: "商品",
    component: "Good",
    children: [
      {
        id: "GoodManagement",
        name: "商品管理",
        component: "GoodManagement"
      },
    ]
  },
  {
    id: "Strategy",
    icon: "profile",
    name: "策略",
    component: "Strategy",
    children: [
      {
        id: "StrategyManagement",
        name: "价格策略管理",
        component: "StrategyManagement"
      },
      {
        id: "StrategySite",
        name: "场地管理",
        component: "StrategySite"
      }
    ]
  },
  {
    id: "Stock",
    icon: "profile",
    name: "库存",
    component: "Stock",
    children: [
      {
        id: "StockStatistics",
        name: "库存统计",
        component: "StockStatistics"
      },
      {
        id: "StockLists",
        name: "仓库列表",
        component: "StockLists"
      },
      {
        id: "PurchasePurchase",
        name: "采购进货",
        component: "PurchasePurchase"
      },
      {
        id: "PurchaseReturns",
        name: "采购退货",
        component: "PurchaseReturns"
      },
      {
        id: "PurchaseInventory",
        name: "采购盘点",
        component: "PurchaseInventory"
      },
      {
        id: "PurchaseReview",
        name: "购货审核",
        component: "PurchaseReview"
      },
      {
        id: "WarehouseQuery",
        name: "仓库查询",
        component: "WarehouseQuery"
      },
      {
        id: "WarehousePurchase",
        name: "仓库进货",
        component: "WarehousePurchase"
      },
      {
        id: "WarehouseTransfer",
        name: "仓库调拨",
        component: "WarehouseTransfer"
      },
      {
        id: "WarehouseRun",
        name: "仓库流水",
        component: "WarehouseRun"
      },
      {
        id: "OrderPay",
        name: "订单支付",
        component: "OrderPay"
      },
      {
        id: "DeliveryOrder",
        name: "提货单",
        component: "DeliveryOrder"
      },
      {
        id: "OrderReturns",
        name: "退货单",
        component: "OrderReturns"
      },
      {
        id: "ProductPrice",
        name: "商品价格",
        component: "ProductPrice"
      },
    ]
  },
  {
    id: "Order",
    icon: "profile",
    name: "订单",
    component: "Order",
    children: [
      {
        id: "OrderManagement",
        name: "订单列表",
        component: "OrderManagement"
      },
      {
        id: "OrderRefund",
        name: "退款订单列表",
        component: "OrderRefund"
      },
      {
        id: "CustomerFeedback",
        name: "用户反馈",
        component: "CustomerFeedback"
      },
    ]
  },
  {
    id: "System",
    icon: "profile",
    name: "系统",
    component: "System",
    children: [
      {
        id: "PaymentConfiguration",
        name: "支付配置",
        component: "PaymentConfiguration"
      },
      {
        id: "UserList",
        name: "用户列表",
        component: "UserList"
      },
      {
        id: "OperatorList",
        name: "运营商列表",
        component: "OperatorList"
      },
      {
        id: "RoleList",
        name: "角色权限",
        component: "RoleList"
      },
      {
        id: "OperationRecord",
        name: "操作记录",
        component: "OperationRecord"
      },
      {
        id: "Logs",
        name: "日志管理",
        component: "Logs"
      },
    ]
  },
  {
    id: "Agency",
    icon: "profile",
    name: "代理商管理",
    component: "Agency",
    children: [
      {
        id: "AgencyList",
        name: "代理商列表",
        component: "AgencyList"
      },
      {
        id: "EquipmentAdjustment",
        name: "设备调整",
        component: "EquipmentAdjustment"
      },
    ]
  },
  {
    id: "setting",
    icon: "profile",
    name: "设置",
    component: "Setting",
    children: [
      {
        id: "setting/roleManager",
        name: "角色管理",
        component: "RoleManager"
      },
      {
        id: "setting/menuManager",
        name: "菜单管理",
        component: "MenuManager"
      },
      {
        id: "setting/apiManager",
        name: "接口管理",
        component: "ApiManager"
      },
    ]
  },
  {
    id: "Replenish",
    icon: "profile",
    name: "补货列表",
    component: "Replenish",
    children: [
      {
        id: "StockReplenish",
        name: "库存列表",
        component: "StockReplenish"
      },
    ]
  },
  {
    id: "Site",
    icon: "profile",
    name: "场地管理",
    component: "Site",
    children: [
      {
        id: "BusinessDistrict",
        name: "场地商圈",
        component: "BusinessDistrict"
      },
      {
        id: "SiteManagement",
        name: "场地管理",
        component: "SiteManagement"
      }
    ]
  },
  {
    id: "Statistics",
    icon: "profile",
    name: "统计",
    component: "Statistics",
    children: [
      {
        id: "StatisticsHome",
        name: "首页统计",
        component: "StatisticsHome"
      }
    ]
  },
  {
    id: "Advertising",
    icon: "profile",
    name: "广告",
    component: "Advertising",
    children: [
      {
        id: "AdvertisingList",
        name: "广告管理",
        component: "AdvertisingList"
      },
      {
        id: "AdvertisingStrategyList",
        name: "广告投放策略",
        component: "AdvertisingStrategyList"
      },
      {
        id: "StrategyList",
        name: "策略列表",
        component: "StrategyList"
      }
    ]
  },
  {
    id: "Collection",
    icon: "money-collect",
    name: "收款订单",
    component: "Collection",
    children: [
      {
        id: "CollectOrder",
        name: "订单列表",
        component: "CollectOrder"
      }
    ]
  },
  {
    id: "Account",
    icon: "",
    name: "收款账号",
    component: "Account",
    children: [
      {
        id: "CollectAccount",
        name: "收款账号",
        component: "CollectAccount"
      }
    ]
  },
];

export default menu;
