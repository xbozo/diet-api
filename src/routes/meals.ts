import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExistence } from '../middlewares/check-session-id-existence'

export const mealsRoutes = async (app: FastifyInstance) => {
	app.get('/', { preHandler: checkSessionIdExistence }, async (req, res) => {
		const { sessionId } = req.cookies

		const meals = await knex('meals').where('user_session_id', sessionId).select()

		if (meals[0].user_session_id !== sessionId) {
			return res.status(401).send({
				error: 'Unauthorized',
			})
		}

		return res.send({
			meals,
		})
	})

	app.get('/:id', { preHandler: checkSessionIdExistence }, async (req, res) => {
		const { sessionId } = req.cookies

		const getMealParamsSchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = getMealParamsSchema.parse(req.params)

		const meal = await knex('meals')
			.where({
				id,
			})
			.first()

		if (meal?.user_session_id !== sessionId) {
			return res.status(401).send({
				error: 'Unauthorized',
			})
		}

		return res.send({ meal })
	})

	app.post('/', { preHandler: checkSessionIdExistence }, async (req, res) => {
		const createMealSchema = z.object({
			title: z.string(),
			description: z.string(),
			is_on_diet: z.boolean(),
			user_id: z.string(),
		})

		const { title, description, is_on_diet, user_id } = createMealSchema.parse(req.body)
		const { sessionId } = req.cookies

		await knex('meals').insert({
			title,
			description,
			is_on_diet,
			user_id,
			user_session_id: sessionId,
		})

		return res.status(201).send()
	})

	app.delete('/', { preHandler: checkSessionIdExistence }, async (req, res) => {
		const { sessionId } = req.cookies

		const deleteMealSchema = z.object({
			id: z.string(),
		})

		const { id } = deleteMealSchema.parse(req.body)

		const meal = await knex('meals')
			.where({
				id,
			})
			.first()

		if (meal?.user_session_id !== sessionId) {
			return res.status(401).send({
				error: 'Unauthorized',
			})
		}

		await knex('meals')
			.delete()
			.where({
				id,
			})
			.first()

		return res.status(204).send()
	})

	app.put('/', { preHandler: checkSessionIdExistence }, async (req, res) => {
		const { sessionId } = req.cookies

		const updateMealSchema = z.object({
			title: z.string(),
			description: z.string(),
			is_on_diet: z.boolean(),
			id: z.string(),
		})

		const { title, description, is_on_diet, id } = updateMealSchema.parse(req.body)

		const meal = await knex('meals')
			.where({
				id,
			})
			.first()

		if (meal?.user_session_id !== sessionId) {
			return res.status(401).send({
				error: 'Unauthorized',
			})
		}

		await knex('meals')
			.update({
				title,
				description,
				is_on_diet,
			})
			.where({
				id,
			})

		return res.status(200).send()
	})
}
