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

	app.get('/summary/:id', async (req, res) => {
		const getUserSummarySchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = getUserSummarySchema.parse(req.params)

		const user = await knex('users')
			.where({
				id,
			})
			.first()

		if (!user) {
			return res.status(404).send()
		}

		let userSummary = {
			totalMeals: 0,
			totalMealsOnDiet: 0,
			totalMealsOutOfDiet: 0,
			biggestDietStreak: 0,
		}

		const userMeals = await knex('meals').where({
			user_id: user.id,
		})

		userSummary.totalMeals = userMeals.length

		userMeals.map((meal) => {
			if (meal.is_on_diet) {
				userSummary.totalMealsOnDiet += 1
			}

			if (!meal.is_on_diet) {
				userSummary.totalMealsOutOfDiet += 1
			}
		})

		const findBiggestMealsOnDietSequence = () => {
			let biggestSequence = 0
			let currentSequence = 0

			for (const meal of userMeals) {
				if (meal.is_on_diet) {
					currentSequence++
				} else {
					currentSequence = 0
				}

				biggestSequence = Math.max(biggestSequence, currentSequence)
			}

			return biggestSequence
		}

		userSummary.biggestDietStreak = findBiggestMealsOnDietSequence()

		return res.send({
			userSummary,
		})
	})

	app.post('/', async (req, res) => {
		const createUserSchema = z.object({
			name: z.string(),
			email: z.string(),
		})

		const { name, email } = createUserSchema.parse(req.body)

		let sessionId = randomUUID()

		res.cookie('sessionId', sessionId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7d
		})

		await knex('users').insert({
			name,
			email,
			session_id: sessionId,
		})

		return res.status(201).send()
	})
}
