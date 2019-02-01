import Index from "./Indexs/Index";
// equipment
import EquipmentManagement from "./Equipment/EquipmentManagement";
import CargoDetail from "./Equipment/CargoDetail";
import EquipmentInfoDetail from "./Equipment/EquipmentInfoDetail";
import EquipmentStatus from "./Equipment/EquipmentStatus";
import EquipmentInfo from "./Equipment/EquipmentInfo";
import EquipmentLose from "./Equipment/EquipmentLose";
import EquipmentLoseDetail from "./Equipment/EquipmentLoseDetail";
import CargoTemplate from "./Equipment/CargoTemplate";
import CargoTemplateDetail from "./Equipment/CargoTemplateDetail";
import StockAdjustment from "./Equipment/StockAdjustment";
import StockAdjustmentList from "./Equipment/StockAdjustmentList";
import EquipmentVersion from "./Equipment/EquipmentVersion";
import EquipmentFailure from "./Equipment/EquipmentFailure";
import CargoFlow from "./Equipment/CargoFlow";
// Good
import GoodManagement from "./Good/GoodManagement";
import GoodManagementDetail from "./Good/GoodManagementDetail";
import BatchManagement from "./Good/BatchManagement";
import GoodManagementSpecifications from "./Good/GoodManagementSpecifications";
// Strategy
import StrategyManagement from "./Strategy/StrategyManagement";
import StrategyManagementDetail from "./Strategy/StrategyManagementDetail";
import StrategySite from "./Strategy/StrategySite";
import StrategySiteDetail from "./Strategy/StrategySiteDetail";
// Stock
import StockStatistics from "./Stock/StockStatistics";
import StockLists from "./Stock/StockLists";
import StockListsDetail from "./Stock/StockListsDetail";
import PurchasePurchase from "./Stock/PurchasePurchase";
import PurchaseReturns from "./Stock/PurchaseReturns";
import PurchaseInventory from "./Stock/PurchaseInventory";
import PurchasePurchaseDetail from "./Stock/PurchasePurchaseDetail";
import PurchaseReturnsDetail from "./Stock/PurchaseReturnsDetail";
import PurchaseInventoryDetail from "./Stock/PurchaseInventoryDetail";
import PurchaseReview from "./Stock/PurchaseReview";
import WarehouseQuery from "./Stock/WarehouseQuery";
import WarehouseRun from "./Stock/WarehouseRun";
import WarehouseTransfer from "./Stock/WarehouseTransfer";
import WarehouseTransferDetail from "./Stock/WarehouseTransferDetail";
import WarehousePurchase from "./Stock/WarehousePurchase";
import WarehousePurchaseDetail from "./Stock/WarehousePurchaseDetail";
import OrderPay from "./Stock/OrderPay";
import ProductPrice from "./Stock/ProductPrice";
import DeliveryOrder from "./Stock/DeliveryOrder";
import DeliveryOrderDetail from "./Stock/DeliveryOrderDetail";
import OrderReturns from "./Stock/OrderReturns";
import OrderReturnsDetail from "./Stock/OrderReturnsDetail";
import StockAdjustmentCensor from "./Stock/StockAdjustmentCensor";
// Order
import OrderManagement from "./Order/OrderManagement";
import OrderRefund from "./Order/OrderRefund";
import CustomerFeedback from "./Order/CustomerFeedback";
import ApplyRefund from "./Order/ApplyRefund";
// System
import PaymentConfiguration from "./System/PaymentConfiguration";
import UserList from "./System/UserList";
import UserListDetail from "./System/UserListDetail";
import RoleList from "./System/RoleList";
import RoleListDetail from "./System/RoleListDetail";
import OperatorList from "./System/OperatorList";
import OperatorListDetail from "./System/OperatorListDetail";
import OperationRecord from "./System/OperationRecord";
import Logs from "./System/Logs";
// Agency
import AgencyList from "./Agency/AgencyList";
import AgencyListDetail from "./Agency/AgencyListDetail";
import AgencyUserList from "./Agency/AgencyUserList";
import AgencyUserListDetail from "./Agency/AgencyUserListDetail";
import AgencyUserDivide from "./Agency/AgencyUserDivide";
import AgencyUserDivide2 from "./Agency/AgencyUserDivide2";
import EquipmentAdjustment from "./Agency/EquipmentAdjustment";
import BillReview from "./Agency/BillReview";
import BillFlow from "./Agency/BillFlow";
import AgencyChange from "./Agency/AgencyChange";
import EquipmentTransfer from "./Agency/EquipmentTransfer";
import TransferList from "./Agency/TransferList";
import Article from './Agency/Article';
import ArticleEdit from './Agency/ArticleEdit';

//设置
import StaffManager from "./Setting/StaffManager";
import StaffManagerAdd from "./Setting/StaffManagerAdd";
import StaffManagerDetail from "./Setting/StaffManagerDetail";
import RoleManager from "./Setting/RoleManager";
import RoleManagerAdd from "./Setting/RoleManagerAdd";
import RoleManagerDetail from "./Setting/RoleManagerDetail";
import MenuManager from "./Setting/MenuManager";
import MenuManagerAdd from "./Setting/MenuManagerAdd";
import MenuManagerDetail from "./Setting/MenuManagerDetail";
import ApiManager from "./Setting/ApiManager";
import ApiManagerDetail from "./Setting/ApiManagerDetail";
// Replenish
import StockReplenish from "./Replenish/StockReplenish";
import StockReplenishDetail from "./Replenish/StockReplenishDetail";
import GetBatch from "./Replenish/GetBatch";
// Site
import BusinessDistrict from "./Site/BusinessDistrict";
import BusinessDistrictDetail from "./Site/BusinessDistrictDetail";
import IndustryManagement from "./Site/IndustryManagement";
import CategoryManagement from "./Site/CategoryManagement";
import SiteManagement from "./Site/SiteManagement";
import SiteManagementDetail from "./Site/SiteManagementDetail";
import PointManagement from "./Site/PointManagement";
import PointManagementDetail from "./Site/PointManagementDetail";
import PointManagementPicture from "./Site/PointManagementPicture";
// Statistics
import StatisticsHome from "./Statistics/StatisticsHome";
// Collection
import CollectOrder from "./Collection/CollectOrder";
// Advertising
import AdvertisingList from "./Advertising/AdvertisingList";
import AdvertisingListAdd from "./Advertising/AdvertisingListAdd";
import AdvertisingListDetail from "./Advertising/AdvertisingListDetail";
import AdvertisingStrategyList from "./Advertising/AdvertisingStrategyList";
import AdvertisingStrategyListAdd from "./Advertising/AdvertisingStrategyListAdd";
import AdvertisingStrategyListDetail from "./Advertising/AdvertisingStrategyListDetail";
import StrategyList from "./Advertising/StrategyList";
// Account
import CollectAccount from "./Account/CollectAccount";
import CollectAccountDetail from "./Account/CollectAccountDetail";
import CollectManagement from "./Account/CollectManagement";

const modules = {
  Index,
  // equipment
  EquipmentManagement,
  CargoDetail,
  EquipmentInfoDetail,
  EquipmentStatus,
  EquipmentInfo,
  EquipmentLose,
  EquipmentLoseDetail,
  CargoTemplate,
  CargoTemplateDetail,
  StockAdjustment,
  StockAdjustmentList,
  EquipmentVersion,
  EquipmentFailure,
  CargoFlow,
  // Good
  GoodManagement,
  GoodManagementDetail,
  BatchManagement,
  GoodManagementSpecifications,
  // Strategy
  StrategyManagement,
  StrategyManagementDetail,
  StrategySite,
  StrategySiteDetail,
  // Stock
  StockStatistics,
  StockLists,
  StockListsDetail,
  PurchasePurchase,
  PurchasePurchaseDetail,
  PurchaseReturns,
  PurchaseReturnsDetail,
  PurchaseInventory,
  PurchaseInventoryDetail,
  PurchaseReview,
  WarehouseQuery,
  WarehouseRun,
  WarehousePurchase,
  WarehousePurchaseDetail,
  OrderPay,
  ProductPrice,
  WarehouseTransfer,
  WarehouseTransferDetail,
  DeliveryOrder,
  DeliveryOrderDetail,
  OrderReturns,
  OrderReturnsDetail,
  StockAdjustmentCensor,
  // Order
  OrderManagement,
  OrderRefund,
  ApplyRefund,
  CustomerFeedback,
  // System
  PaymentConfiguration,
  UserList,
  UserListDetail,
  RoleList,
  RoleListDetail,
  OperatorList,
  OperatorListDetail,
  OperationRecord,
  Logs,
  // Agency
  AgencyList,
  AgencyListDetail,
  AgencyUserList,
  AgencyUserListDetail,
  AgencyUserDivide,
  AgencyUserDivide2,
  EquipmentAdjustment,
  BillReview,
  BillFlow,
  AgencyChange,
  TransferList,
  EquipmentTransfer,
  Article,
  ArticleEdit,
  // 设置
  StaffManager,
  StaffManagerAdd,
  StaffManagerDetail,
  RoleManager,
  RoleManagerAdd,
  RoleManagerDetail,
  MenuManager,
  MenuManagerAdd,
  MenuManagerDetail,
  ApiManager,
  ApiManagerDetail,
  // Replenish
  StockReplenish,
  StockReplenishDetail,
  GetBatch,
  // Site
  BusinessDistrict,
  BusinessDistrictDetail,
  IndustryManagement,
  CategoryManagement,
  SiteManagement,
  SiteManagementDetail,
  PointManagement,
  PointManagementDetail,
  PointManagementPicture,
  // Statistics
  StatisticsHome,
  // CollectOrder
  CollectOrder,
  // Advertising
  AdvertisingList,
  AdvertisingListAdd,
  AdvertisingListDetail,
  AdvertisingStrategyList,
  AdvertisingStrategyListAdd,
  AdvertisingStrategyListDetail,
  StrategyList,
  // Account
  CollectAccount,
  CollectAccountDetail,
  CollectManagement,
};

export default modules;
