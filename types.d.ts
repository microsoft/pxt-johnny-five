declare namespace j5 {
    interface Request {
        id?: string; // request id
        type: string; // request type
        board: string; // board id
    }

    interface Response {
        id: string;
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