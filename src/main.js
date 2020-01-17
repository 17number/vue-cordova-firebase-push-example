import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

let cordova = undefined;
let FirebasePlugin = undefined;
const onDeviceReady = () => {
  console.log("deviceready");
  FirebasePlugin = window.FirebasePlugin;
  cordova = window.cordova;

  FirebasePlugin.onMessageReceived(onFcmReceived, onFcmReceivedError);
  checkNotificationPermission(false);

  console.log({ platformId: cordova.platformId });
  switch (cordova.platformId) {
    case "android":
      break;
    case "ios":
      break;
    default:
      break;
  }
};

// メッセージ受信
const onFcmReceived = message => {
  console.log("onMessageReceived");
  console.log({ message });
  // messageType, tap などに応じて処理分岐できる
};
const onFcmReceivedError = error => {
  console.log("onMessageReceived");
  console.error({ error });
};

// プッシュ通知の権限 確認/要求
const checkNotificationPermission = requested => {
  FirebasePlugin.hasPermission(hasPermission => {
    if (hasPermission) {
      // プッシュ通知の権限 あり
      console.log("Remote notifications permission granted");
      // トークンの取得
      getToken();
    } else if (!requested) {
      // プッシュ通知の権限 要求
      console.log("Requesting remote notifications permission");
      FirebasePlugin.grantPermission(
        checkNotificationPermission.bind(this, true)
      );
    } else {
      console.error("Notifications won't be shown as permission is denied");
    }
  });
};

// トークンの取得
const getToken = () => {
  FirebasePlugin.getToken(
    token => console.log("Got FCM token: " + token),
    error => console.error("Failed to get FCM token", error)
  );
};

document.addEventListener("deviceready", onDeviceReady);
