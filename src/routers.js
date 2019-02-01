export default {
  home: {
    module: "",
    path: "/",
    redirect: "/Equipment/EquipmentManagement",
    subs: {
      //主页
      dashboard: {
        path: "dashboard",
        module: "Indexs",
        component: "Index",
        title: "主页"
      },
      //设置
      Setting:{
      	path: "Setting",
        module: "Setting",
        title: "设置",
        subs:{
		      StaffManager: {
		        path: "/StaffManager",
		        module: "Setting",
		        component: "StaffManager",
		        title: "员工管理",
		        subs: {
		          StaffManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "StaffManagerAdd",
		            title: "新建员工"
		          },
		          StaffManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "StaffManagerDetail",
		            title: "员工详情"
		          }
		        }
		      },
		      RoleManager: {
		        path: "/RoleManager",
		        module: "Setting",
		        component: "RoleManager",
		        title: "角色管理",
		        subs: {
		          RoleManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "RoleManagerAdd",
		            title: "新建角色"
		          },
		          RoleManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "RoleManagerDetail",
		            title: "角色详情"
		          }
		        }
		      },
		      MenuManager: {
		        path: "/MenuManager",
		        module: "Setting",
		        component: "MenuManager",
		        title: "菜单管理",
		        subs: {
		          MenuManagerAdd: {
		            path: "/add",
		            module: "Setting",
		            component: "MenuManagerAdd",
		            title: "新建菜单"
		          },
		          MenuManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "MenuManagerDetail",
		            title: "菜单详情"
		          }
		        }
		      },
		      ApiManager: {
		        path: "/ApiManager",
		        module: "Setting",
		        component: "ApiManager",
		        title: "接口管理",
		        subs: {
		          ApiManagerDetail: {
		            path: "/detail/:id",
		            module: "Setting",
		            component: "ApiManagerDetail",
		            title: "接口详情"
		          }
		        }
		      }
		    }
      },
      Equipment: {
        path: "Equipment",
        module: "Equipment",
        // component: "Equipment",
        title: "设备",
        subs: {
          EquipmentManagement: {
            path: "/EquipmentManagement",
            module: "Equipment",
            component: "EquipmentManagement",
            title: "设备管理",
            subs: {
              CargoDetail: {
                path: "/:id",
                module: "Equipment",
                component: "CargoDetail",
                title: "查看货道",

              }
            }
          },
          EquipmentVersion: {
            path: "/EquipmentVersion",
            module: "Equipment",
            component: "EquipmentVersion",
            title: "设备版本",
          },
          EquipmentStatus: {
            path: "/EquipmentStatus",
            module: "Equipment",
            component: "EquipmentStatus",
            title: "设备状态"
          },
          StockAdjustment: {
            path: "/StockAdjustment",
            module: "Equipment",
            component: "StockAdjustment",
            title: "库存调整",
            subs: {
              EquipmentInfoDetail: {
                path: "/:id",
                module: "Equipment",
                component: "StockAdjustmentList",
                title: "配置信息详情"
              }
            }
          },
          EquipmentInfo: {
            path: "/EquipmentInfo",
            module: "Equipment",
            component: "EquipmentInfo",
            title: "配置信息",
            subs: {
              EquipmentInfoDetail: {
                path: "/:id",
                module: "Equipment",
                component: "EquipmentInfoDetail",
                title: "配置信息详情"
              }
            }
          },
          EquipmentLose: {
            path: "/EquipmentLose",
            module: "Equipment",
            component: "EquipmentLose",
            title: "缺货设备",
            subs: {
              EquipmentLoseDetail: {
                path: "/:id",
                module: "Equipment",
                component: "EquipmentLoseDetail",
                title: "缺货设备详情"
              }
            }
          },
          EquipmentFailure: {
            path: "/EquipmentFailure",
            module: "Equipment",
            component: "EquipmentFailure",
            title: "故障管理",
          },
          CargoTemplate: {
            path: "/CargoTemplate",
            module: "Equipment",
            component: "CargoTemplate",
            title: "货道模板",
            subs: {
              CargoTemplateDetail: {
                path: "/:id",
                module: "Equipment",
                component: "CargoTemplateDetail",
                title: "货道模板详情"
              }
            }
          },
          CargoFlow: {
            path: "/CargoFlow",
            module: "Equipment",
            component: "CargoFlow",
            title: "货道流水",
          }
        }
      },
      Good: {
        path: "Good",
        module: "Good",
        // component: "Good",
        title: "商品",
        subs: {
          GoodManagement: {
            path: "/GoodManagement",
            module: "Good",
            component: "GoodManagement",
            title: "商品管理",
            subs: {
              GoodManagementDetail: {
                path: "/:id",
                module: "Good",
                component: "GoodManagementDetail",
                title: "商品管理详情"
              }
            }
          },
          BatchManagement: {
            path: "/BatchManagement",
            module: "Good",
            component: "BatchManagement",
            title: "批次管理",
          },
          GoodManagementSpecifications: {
            path: "/GoodManagementSpecifications",
            module: "Good",
            component: "GoodManagementSpecifications",
            title: "规格管理",
          }
        }
      },
      Strategy: {
        path: "Strategy",
        module: "Strategy",
        // component: "Strategy",
        title: "策略",
        subs: {
          StrategyManagement: {
            path: "/StrategyManagement",
            module: "Strategy",
            component: "StrategyManagement",
            title: "价格策略管理",
            subs: {
              StrategyManagementDetail: {
                path: "/:id",
                module: "Strategy",
                component: "StrategyManagementDetail",
                title: "价格策略详情"
              }
            }
          },
          StrategySite: {
            path: "/StrategySite",
            module: "Strategy",
            component: "StrategySite",
            title: "场地管理",
            subs: {
              StrategySiteDetail: {
                path: "/:id",
                module: "Strategy",
                component: "StrategySiteDetail",
                title: "场地管理详情"
              }
            }
          }
        }
      },
      Stock: {
        path: "Stock",
        module: "Stock",
        // component: "Stock",
        title: "库存",
        subs: {
          StockStatistics: {
            path: "/StockStatistics",
            module: "Stock",
            component: "StockStatistics",
            title: "库存统计"
          },
          StockLists: {
            path: "/StockLists",
            module: "Stock",
            component: "StockLists",
            title: "仓库列表",
            subs: {
              StockListsDetail: {
                path: "/detail/:id",
                module: "Stock",
                component: "StockListsDetail",
                title: "仓库信息详情"
              }
            }
          },
          PurchasePurchase: {
            path: "/PurchasePurchase",
            module: "Stock",
            component: "PurchasePurchase",
            title: "采购进货",
            subs: {
              PurchasePurchaseDetail: {
                path: "/:id",
                module: "Stock",
                component: "PurchasePurchaseDetail",
                title: "采购进货详情"
              }
            }
          },
          PurchaseInventory: {
            path: "/PurchaseInventory",
            module: "Stock",
            component: "PurchaseInventory",
            title: "采购盘点",
            subs: {
              PurchaseInventoryDetail: {
                path: "/:id",
                module: "Stock",
                component: "PurchaseInventoryDetail",
                title: "采购盘点详情"
              }
            }
          },
          PurchaseReturns: {
            path: "/PurchaseReturns",
            module: "Stock",
            component: "PurchaseReturns",
            title: "采购退货",
            subs: {
              PurchaseReturnsDetail: {
                path: "/:id",
                module: "Stock",
                component: "PurchaseReturnsDetail",
                title: "采购退货详情"
              }
            }
          },
          PurchaseReview: {
            path: "/PurchaseReview",
            module: "Stock",
            component: "PurchaseReview",
            title: "仓库审核"
          },
          ProductPrice: {
            path: "/ProductPrice",
            module: "Stock",
            component: "ProductPrice",
            title: "商品价格"
          },
          OrderPay: {
            path: "/OrderPay",
            module: "Stock",
            component: "OrderPay",
            title: "订单支付"
          },
          WarehousePurchase: {
            path: "/WarehousePurchase",
            module: "Stock",
            component: "WarehousePurchase",
            title: "仓库进货",
            subs: {
              WarehousePurchaseDetail: {
                path: "/:id",
                module: "Stock",
                component: "WarehousePurchaseDetail",
                title: "仓库进货详情"
              }
            }
          },
          WarehouseQuery: {
            path: "/WarehouseQuery",
            module: "Stock",
            component: "WarehouseQuery",
            title: "仓库查询"
          },
          WarehouseRun: {
            path: "/WarehouseRun",
            module: "Stock",
            component: "WarehouseRun",
            title: "库存流水"
          },
          WarehouseTransfer: {
            path: "/WarehouseTransfer",
            module: "Stock",
            component: "WarehouseTransfer",
            title: "库存调拨",
            subs: {
              WarehouseTransferDetail: {
                path: "/:id",
                module: "Stock",
                component: "WarehouseTransferDetail",
                title: "库存调拨详情"
              }
            }
          },
          DeliveryOrder: {
            path: "/DeliveryOrder",
            module: "Stock",
            component: "DeliveryOrder",
            title: "提货单",
            subs: {
              DeliveryOrderDetail: {
                path: "/detail/:id",
                module: "Stock",
                component: "DeliveryOrderDetail",
                title: "提货单详情"
              },
            }
          },
          OrderReturns: {
            path: "/OrderReturns",
            module: "Stock",
            component: "OrderReturns",
            title: "退货单",
            subs: {
              OrderReturnsDetail: {
                path: "/detail/:id",
                module: "Stock",
                component: "OrderReturnsDetail",
                title: "退货单详情"
              },
            }
          },
          StockAdjustmentCensor: {
            path: "/StockAdjustmentCensor",
            module: "Stock",
            component: "StockAdjustmentCensor",
            title: "库存调整审核",
          },
        }
      },
      Order: {
        path: "Order",
        module: "Order",
        // component: "Order",
        title: "订单",
        subs: {
          OrderManagement: {
            path: "/OrderManagement",
            module: "Order",
            component: "OrderManagement",
            title: "订单列表"
          },
          OrderRefund: {
            path: "/OrderRefund",
            module: "Order",
            component: "OrderRefund",
            title: "退款订单列表"
          },
          ApplyRefund: {
            path: "/ApplyRefund",
            module: "Order",
            component: "ApplyRefund",
            title: "申请退款"
          },
          CustomerFeedback: {
            path: "/CustomerFeedback",
            module: "Order",
            component: "CustomerFeedback",
            title: "用户反馈"
          },
        }
      },
      System: {
        path: "System",
        module: "System",
        // component: "System",
        title: "系统",
        subs: {
          PaymentConfiguration: {
            path: "/PaymentConfiguration",
            module: "System",
            component: "PaymentConfiguration",
            title: "支付配置"
          },
          UserList: {
            path: "/UserList",
            module: "System",
            component: "UserList",
            title: "用户管理",
            subs:{
              UserListAdd: {
                path: "/add",
                module: "System",
                component: "UserListAdd",
                title: "新建用户"
              },
              UserListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "UserListDetail",
                title: "用户详情"
              },
            }
          },
          RoleList: {
            path: "/RoleList",
            module: "System",
            component: "RoleList",
            title: "角色权限",
            subs:{
              RoleListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "RoleListDetail",
                title: "角色权限编辑"
              },
            }
          },
          OperatorList: {
            path: "/OperatorList",
            module: "System",
            component: "OperatorList",
            title: "运营商列表",
            subs:{
              OperatorListAdd: {
                path: "/add",
                module: "System",
                component: "OperatorListAdd",
                title: "新建运营商"
              },
              OperatorListDetail: {
                path: "/detail/:id",
                module: "System",
                component: "OperatorListDetail",
                title: "运营商详情"
              },
            }
          },
          OperationRecord: {
            path: "/OperationRecord",
            module: "System",
            component: "OperationRecord",
            title: "操作记录"
          },
          Logs: {
            path: "/Logs",
            module: "System",
            component: "Logs",
            title: "操作日志"
          },
        }
      },
      Agency: {
        path: "Agency",
        module: "Agency",
        // component: "Agency",
        title: "代理商",
        subs: {
          AgencyList: {
            path: "/AgencyList",
            module: "Agency",
            component: "AgencyList",
            title: "代理商列表",
            subs:{
              AgencyListDetail: {
                path: "/detail/:id",
                module: "Agency",
                component: "AgencyListDetail",
                title: "代理商详情"
              },
            }
          },
          EquipmentTransfer: {
            path: "/EquipmentTransfer",
            module: "Agency",
            component: "EquipmentTransfer",
            title: "设备转移"
          },
          TransferList: {
            path: "/TransferList",
            module: "Agency",
            component: "TransferList",
            title: "转移列表"
          },
          AgencyUserList: {
            path: "/AgencyUserList",
            module: "Agency",
            component: "AgencyUserList",
            title: "代理商用户列表",
            subs:{
              AgencyUserListAdd: {
                path: "/add",
                module: "Agency",
                component: "AgencyUserListAdd",
                title: "新建用户"
              },
              AgencyUserListDetail: {
                path: "/detail/:id",
                module: "Agency",
                component: "AgencyUserListDetail",
                title: "用户详情"
              },
              AgencyUserDivide2: {
                path: "/divide/:id",
                module: "Agency",
                component: "AgencyUserDivide2",
                title: "点位分成"
              },
            }
          },
          EquipmentAdjustment: {
            path: "/EquipmentAdjustment",
            module: "Agency",
            component: "EquipmentAdjustment",
            title: "设备调整"
          },
          BillReview:{
            path: "/BillReview",
            module: "Agency",
            component: "BillReview",
            title: "账单审核",
          },
          BillFlow:{
            path: "/BillFlow",
            module: "Agency",
            component: "BillFlow",
            title: "账单流水",
          },
          AgencyChange:{
          	path: "/AgencyChange",
            module: "Agency",
            component: "AgencyChange",
            title: "代理商切换",
          },
          Article:{
          	path: "/Article",
            module: "Agency",
            component: "Article",
            title: "文章管理",
            subs: {
              ArticleEdit: {
                path: "/edit/:id",
                module: "Agency",
                component: "ArticleEdit",
                title: "文章编辑",
              },
            }
          },
          
        }
      },
      Replenish: {
        path: "Replenish",
        module: "Replenish",
        // component: "Replenish",
        title: "补货列表",
        subs: {
          StockReplenish: {
            path: "/StockReplenish",
            module: "Replenish",
            component: "StockReplenish",
            title: "库存列表",
            subs: {
              StockReplenishDetail: {
                path: "/detail",
                module: "Replenish",
                component: "StockReplenishDetail",
                title: "补货列表详情",
              }
            }
          },
          GetBatch: {
            path: "/GetBatch",
            module: "Replenish",
            component: "GetBatch",
            title: "补货批次",
          }
        }
      },
      Site: {
        path: "Site",
        module: "Site",
        // component: "Site",
        title: "场地管理",
        subs: {
          BusinessDistrict: {
            path: "/BusinessDistrict",
            module: "Site",
            component: "BusinessDistrict",
            title: "场地商圈",
            subs: {
              BusinessDistrictDetail: {
                path: "/detail/:id",
                module: "Site",
                component: "BusinessDistrictDetail",
                title: "场地商圈详情",
              }
            }
          },
          SiteManagement: {
            path: "/SiteManagement",
            module: "Site",
            component: "SiteManagement",
            title: "场地管理",
            subs: {
              SiteManagementDetail: {
                path: "/detail/:id",
                module: "Site",
                component: "SiteManagementDetail",
                title: "场地管理详情",
              }
            }
          },
          IndustryManagement:{
            path: "/IndustryManagement",
            module: "Site",
            component: "IndustryManagement",
            title: "行业管理",
            subs:{
              CategoryManagement: {
                path: "/CategoryManagement/:id",
                module: "Site",
                component: "CategoryManagement",
                title: "类别管理",
              },
            }
          },
          PointManagement: {
            path: "/PointManagement",
            module: "Site",
            component: "PointManagement",
            title: "点位管理",
            subs:{
              PointManagementDetail:{
                path: "/:id",
                module: "Site",
                component: "PointManagementDetail",
                title: "点位管理详情",
              },
              PointManagementPicture:{
                path: "/pic/:id",
                module: "Site",
                component: "PointManagementPicture",
                title: "点位图片详情",
              }
            }
          }
        }
      },
      Statistics: {
        path: "Statistics",
        module: "Statistics",
        // component: "Statistics",
        title: "统计",
        subs: {
          StatisticsHome: {
            path: "/StatisticsHome",
            module: "Statistics",
            component: "StatisticsHome",
            title: "统计首页",
          }
        }
      },
      Collection: {
        path: "Collection",
        module: "Collection",
        // component: "Collection",
        title: "收款订单",
        subs: {
          CollectOrder: {
            path: "/CollectOrder",
            module: "Collection",
            component: "CollectOrder",
            title: "收款订单",
          }
        }
      },
      Account: {
        path: "Account",
        module: "Account",
        // component: "Account",
        title: "收款账号",
        subs: {
          CollectOrder: {
            path: "/CollectAccount",
            module: "Account",
            component: "CollectAccount",
            title: "收款账号",
            subs: {
              CollectAccountDetail: {
                path: "/:id",
                module: "Account",
                component: "CollectAccountDetail",
                title: "收款账号详情",
              },
              CollectManagement: {
                path: "/management/:id",
                module: "Account",
                component: "CollectManagement",
                title: "绑定设备",
              },
            }
          }
        }
      },
      Advertising: {
        path: "Advertising",
        module: "Advertising",
        title: "广告",
        subs: {
          AdvertisingList: {
            path: "/AdvertisingList",
            module: "Advertising",
            component: "AdvertisingList",
            title: "广告管理",
            subs: {
              AdvertisingListAdd: {
                path: "/:id",
                module: "Advertising",
                component: "AdvertisingListAdd",
                title: "广告详情",
              },
              AdvertisingListDetail: {
                path: "/deteil/:id",
                module: "Advertising",
                component: "AdvertisingListDetail",
                title: "广告详情",
              }
            }
          },
          AdvertisingStrategyList: {
            path: "/AdvertisingStrategyList",
            module: "Advertising",
            component: "AdvertisingStrategyList",
            title: "投放策略",
            subs: {
              AdvertisingStrategyListAdd: {
                path: "/add",
                module: "Advertising",
                component: "AdvertisingStrategyListAdd",
                title: "新增投放策略",
              },
              AdvertisingStrategyListDetail: {
                path: "/deteil/:id",
                module: "Advertising",
                component: "AdvertisingStrategyListDetail",
                title: "投放策略详情",
              }
            }
          },
          StrategyList: {
            path: "/StrategyList",
            module: "Advertising",
            component: "StrategyList",
            title: "策略列表",
          }
        }
      }
    }
  }
};
