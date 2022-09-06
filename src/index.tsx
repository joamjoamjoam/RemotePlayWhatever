import {PanelSection, PanelSectionRow, ButtonItem, staticClasses, definePlugin, ServerAPI, DropdownItem, Router, SidebarNavigation } from "decky-frontend-lib";
import { VFC, useMemo, useState } from "react";
import { FaShip } from "react-icons/fa";
import * as python from "./python";
import { AddFriendPage, DeleteFriendPage } from "./pages";

 // returns function passed for convenience
// later, to unpatch

var friendsList = new Array<string>()

function getNewRenderTrigger(renderTrigger : boolean){
  var rv = ""
  if(renderTrigger){
    rv = "  "
  }
  else{
    rv = " "
  }

  return rv
}

function setFriendsList(friendsString : string){
  var array = friendsString.split(",")
  friendsList = []
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    friendsList.push(element);
  }
}


const FriendRouter: VFC = () => {
  return (
    <SidebarNavigation
      title="Manage Friends"
      showTitle
      pages={[
        {
          title: "Add Friend",
          content: <AddFriendPage />,
          route: "/addFriends/addFriendID",
        },
        {
          title: "Delete Friend",
          content: <DeleteFriendPage />,
          route: "/addFriends/deleteFriend",
        },
      ]}
    />
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  python.setServer(serverApi);
  python.resolve(python.getNamesForUI(), setFriendsList);


  serverApi.routerHook.addRoute("/addFriends", () => (
    <FriendRouter/>
  ));

  return {
    title: <div className={staticClasses.Title}>Remote Play Whatever</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
    },
  };
});


const Content: VFC<{ serverAPI: ServerAPI; }> = ({}) => {

  const [player1ID, setPlayer1ID] = useState("0")
  const [player2ID, setPlayer2ID] = useState("0")
  const [player3ID, setPlayer3ID] = useState("0")

  var tmpRender = false
  const [rerenderTrigger, setRenderTrigger] = useState("")

  python.resolve(python.getNamesForUI(), (names : string) => {setFriendsList(names); tmpRender = !tmpRender; setRenderTrigger(getNewRenderTrigger(tmpRender))});

  const FriendsDropdownOptions = useMemo(() => {
    console.log("In Memo")
    return [
      { label: "None", data: -1 },
      ...friendsList
      .map((p, index) => ({ label: p, data: index }))
      .sort((a, b) => a.label.localeCompare(b.label))
    ];
  }, [friendsList]);

  return (
    <PanelSection title="Settings">
      <PanelSectionRow>
        <ButtonItem
            layout="below"
            onClick={() => 
              python.execute(python.startRemotePlaySession(player1ID, player2ID, player3ID))
            }
          >
            Start Remote Play Session
          </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
      <DropdownItem
            label={"Friend 1"}
            description={rerenderTrigger}
            menuLabel={"Select First Player to Invite"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              python.resolve(python.getIDForNameForUI(index.label), setPlayer1ID)
            }}
          />
      {/* <DropdownItem
            label={"Friend 2"}
            description={rerenderTrigger}
            menuLabel={"Select Second Player to Invite"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              python.resolve(python.getIDForNameForUI(index.label), setPlayer2ID)
            }}
          />
      <DropdownItem
            label={"Friend 3"}
            description={rerenderTrigger}
            menuLabel={"Select Third Player to Invite"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              python.resolve(python.getIDForNameForUI(index.label), setPlayer3ID)
            }}
          /> */}
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/addFriends");
          }}
        >
          Add to Friends List
        </ButtonItem>

    </PanelSectionRow>
    </PanelSection>
  );
};


