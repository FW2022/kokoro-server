import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayInit,
    OnGatewayConnection,
} from "@nestjs/websockets";
import { from, map, Observable } from "rxjs";
import { Server } from "ws";

@WebSocketGateway(8054, {
    transports: ["websocket"],
})
export class BoardGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("connected")
    handleConnect(client: any, payload: any): string {
        console.log(client);
        console.log(payload);
        return "connected!!!";
    }

    @SubscribeMessage("message")
    handleMessage(client: any, payload: any): string {
        console.log(client);
        console.log(payload);
        return "message!!!";
    }

    @SubscribeMessage("events")
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(
            map((item) => ({ event: "events", data: item }))
        );
    }
}
