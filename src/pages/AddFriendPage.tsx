
import { PanelSectionRow, TextField, ButtonItem, Field, showModal, ModalRoot, staticClasses } from "decky-frontend-lib";
import { VFC, useState } from "react";
import * as python from "../python";

export const AddFriendPage: VFC = () => {

    const [addPlayerName, setAddPlayerName] = useState("Name")
    const [addPlayerID, setAddPlayerID] = useState("1234")

    return(
            <PanelSectionRow>
                <Field
                label="Add Friends"
                description={<TextField
                    label={"Nickname"}
                    tooltip={"Nickname for Friend."}
                    value={addPlayerName}
                    onChange={(elem) => {
                    setAddPlayerName(elem.target.value)
                    }}
                    >
                </TextField>
                }
                >
                </Field>
                <Field
                description={<TextField
                    label={"Steam ID64"}
                    tooltip={"Steam ID64 for friend."}
                    mustBeNumeric={true}
                    value={addPlayerID}
                    onChange={(elem) => {
                        setAddPlayerID(elem.target.value)
                    }}
                    >
                </TextField>
                }
                >
                </Field>
                <ButtonItem
                layout="below"
                onClick={() => {
                    
                    showModal(<ModalRoot
                        onOK={async () => {
                            python.execute(python.addFriendFromUI(addPlayerID, addPlayerName))
                        }}
                        onCancel={async () => {
                        }}
                      >
                        <div className={staticClasses.Title} style={{ flexDirection: 'column' }}>
                         <h3>Add {} to Friends List?</h3>
                        </div>
                     </ModalRoot>)
                }}
                >
                Add Friend
                </ButtonItem>
            </PanelSectionRow>
    );
};