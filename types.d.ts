declare namespace j5 {
    interface Request {
        id?: string; // message id
        type: "connect" | "rpc";
        board: string; // board id
    }

    interface Response {
        req: Request;
        status: number;
    }

    interface ErrorResponse extends Response {
        status: 500;
        error?: any;
    }

    interface ConnectRequest extends Request {
        type: "connect";
    }

    interface RPCRequest extends Request {
        type: "rpc";
        component: string;
        componentArgs?: (number|string)[];
        function: string;
        functionArgs?: (number|string)[];
    }

    interface RPCResponse extends Response {
        resp: any;
    }
}