export interface User {
    isAuthenticated: boolean;
    name: string;
    login: () => void;
    logout: () => void;
    setUsername: (username: string) => void;
}
