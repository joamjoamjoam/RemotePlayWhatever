import {PanelSection, PanelSectionRow, ButtonItem, staticClasses, definePlugin, ServerAPI, DropdownItem, TextField } from "decky-frontend-lib";
import { VFC, useMemo, useState, useRef } from "react";
import { FaShip } from "react-icons/fa";
import * as python from "./python";

 // returns function passed for convenience
// later, to unpatch

var friendsList = new Array<string>()

function setFriendsList(friendsString : string){
  var array = friendsString.split(",")
  friendsList = []
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    friendsList.push(element);
  }
}


export default definePlugin((serverApi: ServerAPI) => {
  python.setServer(serverApi);
  python.resolve(python.getNamesForUI(), setFriendsList);
  return {
    title: <div className={staticClasses.Title}>Remote Play Whatever</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      console.log("Dismounting");
    },
  };
});


const Content: VFC<{ serverAPI: ServerAPI; }> = ({}) => {

  const [player1ID, setPlayer1ID] = useState("0")
  const [player2ID, setPlayer2ID] = useState("0")
  const [player3ID, setPlayer3ID] = useState("0")

  //const [addPlayerName, setAddPlayerName] = useState("Name")
  const nameRef = useRef("Name");
  const [addPlayerID, setAddPlayerID] = useState("1234")

  python.resolve(python.getNamesForUI(), setFriendsList);

  console.log("Friends ")
  console.log(friendsList)

  const FriendsDropdownOptions = useMemo(() => {
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
            menuLabel={"Menu Label"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              // data.index = index.data;
              // data.value = index.label;
              // python.execute(
              //   python.setPatchOfTheme(data.theme.name, data.name, data.value)
              // );
              console.log(index)
              python.resolve(python.getIDForNameForUI(index.label), setPlayer1ID)
            }}
          />
      <DropdownItem
            label={"Friend 2"}
            menuLabel={"Menu Label"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              // data.index = index.data;
              // data.value = index.label;
              // python.execute(
              //   python.setPatchOfTheme(data.theme.name, data.name, data.value)
              // );
              console.log(index)
              python.resolve(python.getIDForNameForUI(index.label), setPlayer2ID)
            }}
          />
      <DropdownItem
            label={"Friend 3"}
            menuLabel={"Menu Label"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(index) => {
              // data.index = index.data;
              // data.value = index.label;
              // python.execute(
              //   python.setPatchOfTheme(data.theme.name, data.name, data.value)
              // );
              console.log(index)
              python.resolve(python.getIDForNameForUI(index.label), setPlayer3ID)
            }}
          />
      </PanelSectionRow>
      <PanelSectionRow>
          <TextField
            label={"Nickname"}
            tooltip={"Nickname for Friend."}
            onChange={(elem) => {
              nameRef.current = elem.target.value
              console.log("Changing to")
              console.log(elem.target.value)
            }}
            value={nameRef.current}
            >
          </TextField>
          <TextField
            label={"Steam ID64"}
            tooltip={"Steam ID64 for friend."}
            mustBeNumeric={true}
            value={"1234567890"}
            >
          </TextField>
          <ButtonItem
            layout="below"
            onClick={() => 
              console.log("Adding Player: " + nameRef.current + " w ID: " + addPlayerID)
            }
          >
            Add to Friends List
          </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};


