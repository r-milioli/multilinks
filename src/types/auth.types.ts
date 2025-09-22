import { User } from '@prisma/client'

export interface AuthUser extends User {
  accounts: any[]
  sessions: any[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  username?: string
}

export interface ResetPasswordData {
  email: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface AuthError {
  type: string
  message: string
}

