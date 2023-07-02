import type { NextApiRequest, NextApiResponse } from "next"
import { Todo } from "../../../../types/Todo"
import { PrismaClient } from '@prisma/client'

/**
 * @swagger
 * /api/todos/delete/{id}:
 *   delete:
 *     description: Delete a to do by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the to do
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: To do deleted successfully
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

export default async function handler
(
	req: NextApiRequest,
	res: NextApiResponse<ResData>
) {
	if (req.method != "DELETE"){return res.status(405).json({message:"method not allowed!"})}
	if (typeof req.query.id != "string"){return res.status(400).json({message:"query needs to be a string"})}
	
	const id: number | null = parseInt(req.query.id)

	if (!id) {return res.status(400).json({message:"invalid id"})}

	const todos: Array<Todo> = await prisma.todo.findMany({
		where: {
			id: {
      	equals: id,
			}
		}}
	)

	if (todos.length == 0){return res.status(400).json({message:"todo not found"})}

	prisma.todo.delete({where: {id}})
	.then((todo: Todo) => {
		return res.status(200).json({todo, message: "Succcess"})
	})
}