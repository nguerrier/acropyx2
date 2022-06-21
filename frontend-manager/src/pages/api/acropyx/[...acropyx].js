import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { request } from 'src/util/backend'

export default withApiAuthRequired(async function handler(req, res) {
    var route = req.url.replace(/^\/api\/acropyx/, '')
    var request_body = null
    if (['POST', 'PUT', 'PATCH'].indexOf(req.method) >= 0) {
        request_body = req.body
    }

    const [status, response_body] = await request(req.method, route, request_body)

    res.status(status).json(response_body)
    res.end()
});
