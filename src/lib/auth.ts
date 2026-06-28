import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  secret: process.env.BETTER_AUTH_SECRET || "1GYO4VXbKG9LFAZcVkaLv93djINpORbB",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "mock_github_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock_github_secret",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID || "mock_twitter_id",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "mock_twitter_secret",
    }
  },
  plugins: [
    dash()
  ]
});
