export interface User {
  email: string;
  role: "admin" | "user";
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
