export interface AuthRequest{
    email: string
    password: string
    login: string
    numberPhone: string
    data: string
    role: "admin" | "customer" | "contractor"
}

export interface AuthResponse{
    access_token: string
    refresh_token: string
    user: {
        id: number
        email: string
        login: string
        numberPhone: string
        data: string
    }
}

export interface JwtPayload {
    userId: number
    role: "admin" | "customer" | "contractor"
}