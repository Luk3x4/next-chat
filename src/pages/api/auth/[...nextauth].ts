import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import prisma from '@/lib/prisma';

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    })
  ],

  callbacks: {
    async signIn({ user }: any) {
      const userExists = await prisma.user.findFirst({
        where: {
          id: user.id
        }
      })

      if(!userExists){
        await prisma.user.create({
          data: {
            id: user.id,
            username: user.name,
            avatar: user.image
          }
        })
      }

      return true;
    },

    session({session, token}: any) {
      session.user.id = token.sub

      return session
    }
  }
}
export default NextAuth(authOptions)