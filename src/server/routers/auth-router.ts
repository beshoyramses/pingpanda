import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "../../db"
import { HTTPException } from "hono/http-exception"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    try {
      const auth = await currentUser()

      if (!auth) return c.json({ isSynced: false })

      const user = await db.user.findFirst({
        where: { externalId: auth.id },
      })

      if (!user) {
        if (!auth.emailAddresses[0]?.emailAddress) {
          throw new HTTPException(400, { message: "Email address is required" })
        }

        await db.user.create({
          data: {
            quotaLimit: 100,
            externalId: auth.id,
            email: auth.emailAddresses[0].emailAddress,
          },
        })
      }

      return c.json({ isSynced: true })
    } catch (error) {
      console.error("Error in getDatabaseSyncStatus:", error)
      throw new HTTPException(500, { message: "Internal Server Error" })
    }
  }),
})  