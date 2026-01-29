export interface AuthRequest{
    email: string
    password: string
    hash_password: string
    login: string
    numberPhone: string
    data: string
}

export interface AuthResponse{
    access_token: string
    refresh_token: string
    user: {
        id: number
        email: string
        hash_password: string
        login: string
        numberPhone: string
        data: string
    }
}

interface JwtPayload {
    userId: number
    role: "admin" | "customer" | "contractor"
}