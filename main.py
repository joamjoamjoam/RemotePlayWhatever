import os

Initialized = False

def log(text : str):
    pass
    #f = open(f"/home/deck/homebrew/plugins/RemotePlayWhatever/log.txt", "a")
    #f.write(text + "\n")
    #f.close()




class Plugin:

    async def startRemotePlaySession(self):
        log("Calling RPW")
        rc = os.system("export DISPLAY=:1; /home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage -a 291550 -i \"0\"")
        log("rpw ended with rc: " + str(rc))

            

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        if not Initialized:
            Initialized = True
            log("Setting permissions")
            rc = os.system("sudo chmod 777 /home/deck/homebrew/plugins/RemotePlayWhatever/RemotePlayWhatever.AppImage")
            log("ended with rc: " + str(rc))
        else:
            log("Skipping permissions")
            return
