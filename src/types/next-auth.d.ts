import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      username?: string
      avatar?: string
      role?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    username?: string
    avatar?: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string
    avatar?: string
    role?: string
  }
}
