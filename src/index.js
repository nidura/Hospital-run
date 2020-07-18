import "babel-polyfill";
import "typeface-roboto";
import loadable from "@loadable/component";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import history from "./history";
import "./react-table-defaults";
import "./styles/index.css";
import JssProvider from "react-jss/lib/JssProvider";
import { create } from "jss";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { routes } from "./fuse-configs/fuseRoutesConfig";
import { FuseLayout, FuseTheme, FuseAuthorization } from "@fuse";
import jssExtend from "jss-extend";
import store from "store";
import { Auth } from "auth";
import "./styles/custom.css";

const MainToolbar = loadable(() => import("./main/MainToolbar"));
const MainNavbarContent = loadable(() => import("./main/MainNavbarContent"));
const MainNavbarHeader = loadable(() => import("./main/MainNavbarHeader"));
// import MainFooter from './main/MainFooter';
const QuickPanel = loadable(() => import("main/quickPanel/QuickPanel"));
const SettingsPanel = loadable(() => import("main/SettingsPanel"));
// const ChatPanel = loadable(() => import('main/chatPanel/ChatPanel'));
// const EnvironmentSetting = loadable(() => import('main/environmentPanel/EnvironmentSetting'));

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()]
});

// const env = process.env.ENVIRONMENT || 'QA';
      const env = process.env.REACT_APP_ENVIRONMENT || "LOCAL";
  //  const env = process.env.REACT_APP_ENVIRONMENT || "HR";
//  const env = process.env.REACT_APP_ENVIRONMENT || "QA";

console.log("env" + env);

const DEV_GW_IP = "http://35.226.170.156:8080";
const QA_GW_IP = "http://192.169.143.105";
const LIVE_GW_IP = "http://35.188.55.105:8080";

if (env === "DEV") {
  window.authServer = DEV_GW_IP + "/auth";
  window.systemServer = DEV_GW_IP + "/sys";
  window.hrmServer = DEV_GW_IP + "/hrm";
  window.invServer = DEV_GW_IP + "/inv";
  window.reportServer = DEV_GW_IP + "/report";
  // window.chatServer = 'http://35.184.235.1:7055';
  window.imageUploadServer = "http://35.225.185.24:3006";
} else if (env === "QA") {
  window.authServer = QA_GW_IP + ":6070";
  window.systemServer = QA_GW_IP + ":6071";
  window.hrmServer = QA_GW_IP + ":6073";
  window.invServer = QA_GW_IP + ":6072";
  window.reportServer = QA_GW_IP + ":6078";
  window.crmServer = QA_GW_IP + ":6080";
  window.imageUploadServer = QA_GW_IP + ":6075";
} else if (env === "ZINCAT_LIVE") {
  window.authServer = LIVE_GW_IP + "/auth";
  window.systemServer = LIVE_GW_IP + "/sys";
  window.hrmServer = LIVE_GW_IP + "/hrm";
  window.invServer = LIVE_GW_IP + "/inv";
  window.reportServer = LIVE_GW_IP + "/report";
  window.imageUploadServer = "http://35.225.185.24:3006";
} else if (env === "HR") {
  window.serverURL = "http://hr.zincat.net/";
  window.hrmServer = "http://192.169.143.105:9021";
  // window.reportServer = "http://192.168.143.105:7078";
  window.authServer = "http://192.169.143.105:9070";
  window.systemServer = "http://192.169.143.105:9022";
  window.invServer = "http://192.169.143.105:6072";
  window.crmServer = "http://localhost:7080";
  window.imageUploadServer = "http://192.169.143.105:9023";
  // window.gatewayServer = "http://192.168.143.105:7079";
  // window.chatServer = "http://192.168.143.105:7077";

}
else {
  window.serverURL = "http://hr.zincat.net/";
  window.hrmServer = "http://localhost:7073";
  window.reportServer = "http://localhost:7078";
  window.authServer = "http://localhost:7070";
  window.systemServer = "http://localhost:7071";
  window.invServer = "http://localhost:7072";
  window.crmServer = "http://localhost:7080";
  window.imageUploadServer = "http://192.169.143.105:9023";
  window.gatewayServer = "http://localhost:7079";
  window.chatServer = "http://localhost:7077";

}

jss.options.insertionPoint = document.getElementById("jss-insertion-point");
const generateClassName = createGenerateClassName();

ReactDOM.render(
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <Provider store={store}>
      <Auth>
        <Router history={history}>
          <FuseAuthorization routes={routes}>
            <FuseTheme>
              <FuseLayout
                routes={routes}
                toolbar={<MainToolbar />}
                navbarHeader={<MainNavbarHeader />}
                navbarContent={<MainNavbarContent />}
                // footer={
                //     <MainFooter/>
                // }
                // rightSidePanel={
                //   <Fragment>
                //     {/* <ChatPanel /> */}
                //     <QuickPanel />
                //   </Fragment>
                // }
                contentWrapper={<SettingsPanel />}
              ></FuseLayout>
            </FuseTheme>
          </FuseAuthorization>
        </Router>
      </Auth>
    </Provider>
  </JssProvider>,
  document.getElementById("root")
);

registerServiceWorker();
