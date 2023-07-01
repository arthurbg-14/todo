import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../utils/prisma"
import type { Todo } from "../../../../types/Todo"
import Joi from 'joi'
import { createToDo } from "../new"

type ResData = {
	todo?: Todo,
	message: string
}

export default function handler
(
	req: NextApiRequest,
	res: NextApiResponse<ResData>
) {
	if (req.method != "PUT"){return res.status(405).json({message:"method not allowed!"})}
	if (typeof req.query.id != "string"){return res.status(400).json({message:"query needs to be a string"})}
	
	const id: number | null = parseInt(req.query.id)

	if (!id) {return res.status(400).json({message:"invalid id"})}

	const todoSchema = Joi.object({
		name: Joi.string(),
		data: Joi.string(),
		checked: Joi.boolean(),
	})

	const { error, value } = todoSchema.validate(req.body);

	if (error){
		return res.status(400).json({message: JSON.stringify(error.details)})
	}

	prisma.todo.upsert({
		where: {id},
		update: value,
		create: createToDo(value),
	})
	.then((todo: Todo) => {
		return res.status(200).json({todo, message:"Success"})
	})
}