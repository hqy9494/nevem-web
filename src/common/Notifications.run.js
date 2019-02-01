import notifyAlert from "../components/Common/notify";

export default () => {
  // Notifiy
  $("[data-notify]").each(notifyAlert);
};
