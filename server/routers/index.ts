import userRoute from '../routers/user'
import idolRoute from '../routers/idol'
import groupRoute from '../routers/group'
import favoriteRoute from '../routers/favorite'
import voteRoute from '../routers/vote'

export default {
    path: '/api',
    routes: [userRoute, idolRoute, groupRoute, favoriteRoute, voteRoute],
}
