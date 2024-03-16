import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export const usersRoutes = async (app: FastifyInstance) => {
	app.get('/', async (req, res) => {
		const users = await knex('users').select()

		return res.send({
			users,
		})
	})

	app.post('/', async (req, res) => {
		const createUserSchema = z.object({
			name: z.string(),
			email: z.string(),
		})

		const { name, email } = createUserSchema.parse(req.body)

		let sessionId = req.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			res.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7d
			})
		}

		await knex('users').insert({
			name,
			email,
			session_id: sessionId,
		})

		return res.status(201).send()
	})
}
