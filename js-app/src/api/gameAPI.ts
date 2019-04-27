const wsURL = 'wss://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev';

interface Props {
    gameID: string;
    displayName: string;
}

class GameAPI {
    gameID: string;
    displayName: string;
    socket: WebSocket;
    constructor(props:Props) {
        this.gameID = props.gameID;
        this.displayName = props.displayName;
        const socket = new WebSocket('wss://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev');

        socket.onopen = this.onOpen;
        socket.onmessage = this.onMessage;

        this.socket = socket;
    }

    sendMessage(message: string) {
        const payload = {
            action: "send_message",
            message: message,
            game_id: this.gameID,
            name: this.displayName
        }
        this.socket.send(JSON.stringify(payload))
    }

    private onOpen = (event: Event) => {
        const message = {
            action: "join",
            game_id: this.gameID,
            name: this.displayName,
        }
        this.socket.send(JSON.stringify(message));
    }

    private onMessage = (event: MessageEvent) => {
        console.log(event)
    }
}


export default GameAPI;