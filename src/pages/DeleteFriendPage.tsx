
import { PanelSectionRow, DropdownItem, ButtonItem, showModal, ModalRoot, staticClasses} from "decky-frontend-lib";
import { VFC, useMemo, useState} from "react";
import * as python from "../python";

var friendsList = new Array<string>()
var tmpRender = false;

function setFriendsList(friendsString : string){
    var array = friendsString.split(",")
    friendsList = []
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.length > 0){
            friendsList.push(element);
        }
    }
}

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

export const DeleteFriendPage: VFC = () => {

    const [friendToDelete, setFriendToDelete] = useState("None")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [renderTrigger, setRenderTrigger] = useState("")

    python.resolve(python.getNamesForUI(), (names : string) => {setFriendsList(names); setRenderTrigger(getNewRenderTrigger(!tmpRender)); if(friendsList.length > 0){ setFriendToDelete(friendsList[0]); }});
    

    const FriendsDropdownOptions = useMemo(() => {
        return [
          ...friendsList
          .map((p, index) => ({ label: p, data: index }))
          .sort((a, b) => a.label.localeCompare(b.label))
        ];
      }, [friendsList]);

    return(
        <PanelSectionRow>
            <DropdownItem
              label={"Delete Friend"}
              description={renderTrigger}
              menuLabel={"Choose Friend to Delete"}
              rgOptions={FriendsDropdownOptions}
              selectedOption={selectedIndex}
              onChange={(index) => {
                setFriendToDelete(index.label)
                setSelectedIndex(index.data)
              }}
            />
            <ButtonItem
                layout="below"
                onClick={() => {

                    showModal(<ModalRoot
                        onOK={async () => {
                            python.resolve(python.deleteFriendFromUI(friendToDelete), () => {python.resolve(python.getNamesForUI(), (names : string) => {setFriendsList(names); tmpRender = !tmpRender; setSelectedIndex(-1); setRenderTrigger(getNewRenderTrigger(tmpRender))});});
                        }}
                        onCancel={async () => {
                        }}
                      >
                        <div className={staticClasses.Title} style={{ flexDirection: 'column' }}>
                         <h3>Delete {friendToDelete} from Friends List?</h3>
                        </div>
                     </ModalRoot>)
                }}
                >
                Delete Friend
            </ButtonItem>
        </PanelSectionRow>
    );
};