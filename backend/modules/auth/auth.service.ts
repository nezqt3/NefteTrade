import { AuthRequest, AuthResponse } from './auth.types'

export async function authService(data: AuthRequest): Promise<AuthResponse> {
    return {
        access_token: "123",
        refresh_token: "123",
        user: {
            id: 1,
            email: "das",
            hash_password: "321",
            login: "32131",
            numberPhone: "231321",
            data: "231321"
        }
    }
}