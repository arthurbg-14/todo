import type { NextApiRequest, NextApiResponse } from "next"
import type { Todo } from "../../../../types/Todo"
import Joi from 'joi'
import { createToDo } from "../new"
import { PrismaClient } from '@prisma/client'

/**
 * @swagger
 * /api/todos/edit/{id}:
 *   put:
 *     description: Edit a to do by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the to do
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: To do updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     data:
 *                       type: string
 *                     checked:
 *                       type: boolean
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 */

const prisma = new PrismaClient()

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

	try{
		req.body = JSON.parse(req.body)
	}catch(e){}

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