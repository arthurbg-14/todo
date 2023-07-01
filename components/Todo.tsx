import { Todo } from "../types/Todo"

export default function Todo(props: {todo: Todo}) {
	return (
		<div className="bg-lime-400 p-2 rounded	 font-bold">
			<input type="checkbox" value={`${props.todo.checked}`} />
			{props.todo.name}
		</div>
	)
}