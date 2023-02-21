import NextAuth, {AuthOptions} from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import {adminEmails} from '@/src/constants';
import * as process from 'process';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET ?? 'notARealSecret',
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
        // ...add more providers here
    ],
    callbacks: {
        signIn: (params) => {
            const { account, profile } = params;
            if ((account?.provider ?? '') === 'google') {
                return adminEmails.includes(profile?.email ?? '')
            }
            return false
        }
    }
}

export default NextAuth(authOptions)
