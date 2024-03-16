// eslint-disable-next-line
// prettier-disable-next-line
import 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		users: {
			id: string
			name: string
			email: string
			session_id?: string
		}

		meals: {
			id: string
			title: string
			description: string
			created_at: Date
			is_on_diet: boolean

			user_id: string
			user_session_id: string
		}
	}
}
