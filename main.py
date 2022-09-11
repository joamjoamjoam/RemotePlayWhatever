import json
import os
from tokenize import String

Initialized = False


def log(text: str):
    # return
    try:
        f = open("/tmp/log.txt", "a")
        f.write(text + "\n")
        f.close()
    except:
        pass


class Plugin:

    async def startRemotePlaySession(self, player1ID, player2ID, player3ID):

        commandIsValid = False
        player1ID = str(player1ID)
        player2ID = str(player2ID)
        player3ID = str(player3ID)

        log(f"IDs:\nP1:{player1ID}\nP2:{player2ID}\nP3:{player3ID}")

        # Ensure Each ID is Unique

        tmpDict = {}

        tmpDict[player1ID] = ""
        tmpDict[player2ID] = ""
        tmpDict[player3ID] = ""

        rc = 0
        command = "export DISPLAY=:1 "
        rpwCommandTemplate = "/home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage -a 291550 -i \"<playerIDString>\""

        tmpList = []

        for key in tmpDict.keys():
            if int(key) > 0:
                commandIsValid = True
                tmpList.append(key)

        command = command + " && " + \
            rpwCommandTemplate.replace("<playerIDString>", ",".join(tmpList))
        log(f"Running RPW Command: {command}")

        if commandIsValid:
            rc = os.system(command)
        log("rpw ended with rc: " + str(rc))

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded

    async def _main(self):
        if not Initialized:
            Initialized = True
            log("Setting permissions")
            rc = 0
            rc = os.system(
                "chmod 777 /home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage")
            log("ended with rc: " + str(rc))
        else:
            log("Skipping permissions")
            return
