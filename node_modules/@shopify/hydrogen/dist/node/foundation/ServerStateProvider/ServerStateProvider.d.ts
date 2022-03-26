import React, { ReactNode } from 'react';
declare global {
    var __DEV__: boolean;
}
export interface ServerState {
    pathname: string;
    search: string;
    [key: string]: any;
}
export interface ServerStateSetter {
    (input: ((prev: ServerState) => Partial<ServerState>) | Partial<ServerState> | string, propValue?: any): void;
}
export interface ServerStateContextValue {
    pending: boolean;
    serverState: ServerState;
    setServerState: ServerStateSetter;
}
export declare const ServerStateContext: React.Context<ServerStateContextValue>;
interface ServerStateProviderProps {
    serverState: ServerState;
    setServerState: React.Dispatch<React.SetStateAction<ServerState>>;
    children: ReactNode;
}
export declare function ServerStateProvider({ serverState, setServerState, children, }: ServerStateProviderProps): JSX.Element;
export {};
