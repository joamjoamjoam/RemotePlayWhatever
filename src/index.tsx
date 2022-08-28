import {PanelSection, PanelSectionRow, ButtonItem, staticClasses, definePlugin, ServerAPI } from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";
import * as python from "./python";

 // returns function passed for convenience
// later, to unpatch


const Content: VFC<{ serverAPI: ServerAPI; }> = ({serverAPI}) => {

  python.setServer(serverAPI);

  return (
    <PanelSection title="Settings">
      <PanelSectionRow>
        <ButtonItem
            layout="below"
            onClick={(e) => 
              python.execute(python.startRemotePlaySession())
            }
          >
            Start Remote Play Session
          </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};


export default definePlugin((serverApi: ServerAPI) => {
  

  return {
    title: <div className={staticClasses.Title}>CSS Theme Extensions</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      console.log("Dismounting");
    },
  };
});