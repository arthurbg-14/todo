import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'
import type { Todo } from '../../../types/Todo'

type ResData = {
	todo?: Todo,
	message : string
}

export default function handler(
	req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
	if (req.method != "POST"){return res.status(405).json({message: "method not allowed!"})}

	const todoSchema = createToDo(req.body)

	prisma.todo.create({
		data: todoSchema
	}).then((todo: Todo) => {
		if(!todo) {return res.status(500).json({message: "internal server error!"})}

		return res.status(200).json({todo, message: "Success"})
	})
}

export function createToDo(body: any) {
	const createdBy: string = (body.createdBy ?? "void").toLowerCase()
	const todo: Todo = {
		name: body.name ?? "",
		data: body.data ?? "",
		checked: body.checked ?? false,
		createdBy: createdBy,
	}

	return todo
}