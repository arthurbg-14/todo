import type { NextApiRequest, NextApiResponse } from 'next'
import type { Todo } from '../../../types/Todo'
import { PrismaClient } from '@prisma/client'

/**
 * @swagger
 * /api/todos/new:
 *   post:
 *     description: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               data:
 *                 type: string
 *               checked:
 *                 type: boolean
 *               createdby:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 data:
 *                   type: string
 *                 checked:
 *                   type: boolean
 *                 createdBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */


const prisma = new PrismaClient()

type ResData = {
	todo?: Todo,
	message : string
}

export default async function handler(
	req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
	if (req.method != "POST"){return res.status(405).json({message: "method not allowed!"})}

	try{
		req.body = JSON.parse(req.body)
	}catch(e){}

	const todoSchema = createToDo(req.body)

	const todo: Todo = await prisma.todo.create({
		data: todoSchema
	})

	if(!todo) {return res.status(500).json({message: "internal server error!"})}

	return res.status(200).json({todo, message: "Success"})
}

export function createToDo(body: any) {
	const createdby: string = (body.createdby ?? "void").toLowerCase()
	const todo: Todo = {
		name: body.name ?? "",
		data: body.data ?? "",
		checked: body.checked ?? false,
		createdBy: createdby,
	}

	return todo
}