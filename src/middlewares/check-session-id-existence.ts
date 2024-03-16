import { FastifyReply, FastifyRequest } from 'fastify'

export const checkSessionIdExistence = async (req: FastifyRequest, res: FastifyReply) => {
	const sessionId = req.cookies.sessionId

	if (!sessionId) {
		return res.status(401).send({
			error: 'Unauthorized.',
		})
	}
}
