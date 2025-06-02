export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
}

export interface AuthState{
    user: User | null;
    token: string | null;
    loading: boolean;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    login: ({idToken}:{idToken: string}) => Promise<void>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export interface SocketState{
    socket: WebSocket | null,
    setSocket : (s: WebSocket)=>void
}

export interface VideoState{
    peerConnection: RTCPeerConnection | null;
    setPeerConnection: (p: RTCPeerConnection | null) => void;
    myStream : MediaStream | null;
    setMyStream : (s: MediaStream | null) => void;
    remoteStream : MediaStream | null;
    setRemoteStream : (s: MediaStream | null) => void;
}

export interface CodeState{
    code: string | undefined;
    setCode: (c: string) => void;
}

