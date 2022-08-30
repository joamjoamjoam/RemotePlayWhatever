import { ServerAPI } from "decky-frontend-lib";

var server: ServerAPI | undefined = undefined;

export function resolve(promise: Promise<any>, setter: any) {
    (async function () {
        let data = await promise;
        if (data.success) {
            console.debug("Got resolved", data, "promise", promise);
            setter(data.result);
        } else {
            console.warn("Resolve failed:", data, "promise", promise);
        }
    })();
}

export function execute(promise: Promise<any>) {
    (async function () {
        let data = await promise;
        if (data.success) {
            console.debug("Got executed", data, "promise", promise);
        } else {
            console.warn("Execute failed:", data, "promise", promise);
        }

    })();
}

export function setServer(s: ServerAPI) {
    server = s;
}

// Python functions
export function startRemotePlaySession(player1ID: string, player2ID: string, player3ID: string): Promise<any> {
    return server!.callPluginMethod("startRemotePlaySession", { player1ID: player1ID, player2ID : player2ID, player3ID : player3ID });
}

export function getNamesForUI(): Promise<any> {
    return server!.callPluginMethod("getNamesForUI", {});
}

export function getIDForNameForUI(friendName: string): Promise<any> {
    return server!.callPluginMethod("getIDForNameForUI", {friendName: friendName});
}

export function addFriendFromUI( friendID : string, friendName: string): Promise<any> {
    return server!.callPluginMethod("addFriendFromUI", {friendID : friendID, friendName: friendName});
}

export function deleteFriendFromUI(friendName: string): Promise<any> {
    return server!.callPluginMethod("deleteFriendFromUI", {friendName: friendName});
}