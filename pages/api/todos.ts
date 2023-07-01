import type { NextApiRequest, NextApiResponse } from 'next'
import type { Todo } from '../../types/Todo'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
		orderBy: [
				{
					name: 'desc',
				},
			]
		}
	)

	return res.status(200).json({todos, message: "Success"})
}
