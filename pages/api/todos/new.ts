import type { NextApiRequest, NextApiResponse } from 'next'
import type { Todo } from '../../../types/Todo'
import { PrismaClient } from '@prisma/client'

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

	const todoSchema = createToDo(JSON.parse(req.body))

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