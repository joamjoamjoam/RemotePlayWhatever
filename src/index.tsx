import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  staticClasses,
  definePlugin,
  ServerAPI,
  SingleDropdownOption,
  DropdownItem,
  Router,
} from "decky-frontend-lib";
import { VFC, useMemo, useState } from "react";
import { FaShip } from "react-icons/fa";
import * as python from "./python";

type Friend = {
  name: string;
  steamId: string;
};

type SelectedPlayers = string[];

export default definePlugin((serverApi: ServerAPI) => {
  python.setServer(serverApi);

  return {
    title: <div className={staticClasses.Title}>Remote Play Whatever</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {},
  };
});

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  // @ts-ignore:next-line (window is untyped)
  const friends: Friend[] = window.friendStore.allFriends.map((friend) => {
    return {
      name: friend.displayName,
      steamId: friend.m_persona.m_steamid.ConvertTo64BitString(),
    };
  });

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<SelectedPlayers>([
    "0",
    "0",
    "0",
  ]);

  const FriendsDropdownOptions = useMemo(() => {
    return [
      { label: "None", data: -1 },
      ...friends
        .map((player, index) => ({
          label: player.name,
          data: index,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [friends]);

  const handlePlayerSelectionChange = (
    option: SingleDropdownOption,
    dropDownIndex: number
  ) => {
    const selectedFriend =
      option.label === "None"
        ? { name: "None", steamId: "0" }
        : (friends.find((friend) => friend.name === option.label) as Friend);

    const newSelectedPlayers = selectedPlayerIds.map((playerId, index) => {
      if (index === dropDownIndex) {
        return selectedFriend.steamId;
      }
      return playerId;
    });

    setSelectedPlayerIds(newSelectedPlayers);
  };

  return (
    <PanelSection>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() =>
            python.execute(
              python.startRemotePlaySession(
                selectedPlayerIds[0],
                selectedPlayerIds[1],
                selectedPlayerIds[2]
              )
            )
          }
        >
          Start Remote Play Session
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        {Array.from(Array(3).keys()).map((index) => (
          <DropdownItem
            label={`Friend ${index + 1}`}
            menuLabel={"Select Player to Invite"}
            rgOptions={FriendsDropdownOptions}
            selectedOption={-1}
            onChange={(option) => {
              handlePlayerSelectionChange(option, index);
            }}
          />
        ))}
      </PanelSectionRow>
      <ButtonItem
        label="Brawlhalla (donor game) must be in your library."
        layout="below"
        onClick={() => {
          Router.CloseSideMenus();
          Router.NavigateToStoreApp(291550);
        }}
      >
        Brawlhalla Store Page
      </ButtonItem>
    </PanelSection>
  );
};
