import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const categoryRouter = router({
    getEventCategory: privateProcedure.query(async ({input, c, ctx}) => {
    const categories = await db.eventCategory.findMany({
        where: {userId: ctx.user.id},
    })

       
    return c.json({})
    })
})