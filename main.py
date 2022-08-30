import json
import os
from tokenize import String

Initialized = False
jsonPath = "/home/deck/RemotePlayWhatever/friends.json"

def log(text : str):
    #return
    try:
        f = open("/tmp/log.txt", "a")
        f.write(text + "\n")
        f.close()
    except:
        pass

def createNewFriendsJson():
    
    if os.path.isdir(os.path.dirname(jsonPath)):
        if not os.access(jsonPath, os.W_OK):
            os.system(f"chmod +w {os.path.dirname(jsonPath)}")

        f = open(jsonPath, "a")
        f.write('{}')
        f.close()
    else:
        try:
            os.mkdir(os.path.dirname(jsonPath))
            if os.path.isdir(os.path.dirname(jsonPath)):
                createNewFriendsJson()
        except:
            pass

def getFriendsJson():
    jsonDict = {}
    try:
        if os.path.exists(jsonPath):
            if not os.access(jsonPath, os.R_OK):
                os.system(f"chmod +r {os.path.dirname(jsonPath)}")
        else:
            log("Creating new Friends JSON on read")
            createNewFriendsJson()
        
        log("reading new Friends JSON on read")
        f = open(jsonPath)
        jsonDict = json.load(f)
        f.close()
    except:
        log("Error loading Friends JSON")
    
    return jsonDict

def saveFriendsJson(jsonList):
    try:
        if os.path.isdir(os.path.dirname(jsonPath)):
            if not os.access(jsonPath, os.W_OK):
                os.system(f"chmod +w {os.path.dirname(jsonPath)}")

            f = open(jsonPath, "w")
            f.write(json.dumps(jsonList))
            f.close()
        else:
            createNewFriendsJson()
            if os.path.isdir(os.path.dirname(jsonPath)):
                saveFriendsJson(jsonList)
    except:
        pass

def addFriend(friendID, friendName):
    log(f"Adding Friend {friendName} with ID {friendID}")
    
    friendsDict = getFriendsJson()

    try:
        friendsDict[str(friendName)] = str(friendID)
        saveFriendsJson(friendsDict)
    except:
        log("Error Adding friend")

def deleteFriendWithName(friendName):
    log(f"Deleting Friend {friendName}")
    
    friendsDict = getFriendsJson()

    try:
        if(friendName in friendsDict.keys()):
            del friendsDict[friendName]
            saveFriendsJson(friendsDict)
    except:
        log("Error Deleting friend")

def getNames():
    friendsNames = ""
    friendsDict = getFriendsJson()
    if len(friendsDict.keys()) > 0:
        try:
            friendsNames = ','.join([str(x) for x in friendsDict.keys()])
        except:
            log("Error Getting names")
    else:
        log("Error Getting Names JSON")

    return friendsNames

def getIDForName(friendName):
    friendsID = 0
    friendsDict = getFriendsJson()
    if len(friendsDict.keys()) > 0:
        try:
            friendsID = str(friendsDict[friendName])
        except:
            pass
    else:
        log("Error Getting Ids JSON")

    return friendsID

class Plugin:

    async def getIDForNameForUI(self, friendName):
        return getIDForName(friendName)

    async def getNamesForUI(self):
        return getNames()

    async def addFriendFromUI(self, friendID, friendName):
        addFriend(friendID, friendName)
    
    async def deleteFriendFromUI(self, friendName):
        deleteFriendWithName(friendName)

    async def startRemotePlaySession(self, player1ID, player2ID, player3ID):
        # jqui: 76561198042324773
        # repressive: 76561197963847260
        # kris: 76561198334946866
        # twins: 76561198127153328
        # addFriend("76561198127153328","Twinz")
        # addFriend("76561198334946866","kris")
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
        rpwCommandTemplate = "/home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage -a 291550 -i \"<plid>\""

        for key in tmpDict.keys():
            if int(key) > 0:
                commandIsValid = True
                command = command + " && " + rpwCommandTemplate.replace("<plid>", key)

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
            rc = os.system("chmod 777 /home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage")
            log("ended with rc: " + str(rc))
        else:
            log("Skipping permissions")
            return