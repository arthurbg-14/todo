	import type { NextApiRequest, NextApiResponse } from 'next'
	import type { Todo } from '../../../types/Todo'
	import { PrismaClient } from '@prisma/client'

	const prisma = new PrismaClient()

	/**
	 * @swagger
	 * /api/todos:
	 *   get:
	 *     description: Return all to dos filtered by username
	 *     parameters:
	 *       - in: query
	 *         name: username
	 *         required: true
	 *         description: Username of to do author
	 *         schema:
	 *           type: string
	 *     responses:
	 *        200:
	 *          description: Return a list of To Dos.
	 *          content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 todos:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     properties:
	 *                       id:
	 *                         type: integer
	 *                       name:
	 *                         type: string
	 *                       data:
	 *                         type: string
	 *                       checked:
	 *                         type: boolean
	 *                       createdBy:
	 *                         type: string
	 *                       createdAt:
	 *                         type: string
	 *                         format: date-time
	 *                 message:
	 *                   type: string
	 */

	type ResData = {
		todos: Array<Todo>
		message: string
	}

	export default async function handler(
		req: NextApiRequest,
		res: NextApiResponse<ResData>
	) {
		if (req.method != "GET"){return res.status(405).json({todos: [], message: "method not allowed!"})}
		
		const createdBy = Array.isArray(req.query.username) ? req.query.username[0] : req.query.username	

		if (!createdBy) {
			return res.status(403).json({todos: [], message: "username not found!"})
		}

		const todos = await prisma.todo.findMany({
			where: {createdBy:{equals: createdBy}},
			}
		)

		return res.status(200).json({todos, message: "Success"})
	}
