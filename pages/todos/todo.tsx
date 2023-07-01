type Todo = {
  name: string
  data: string
}

export default function Todo(props: any) {
	return (
		<div className="bg-lime-400 p-2 rounded	 font-bold">
			<input type="checkbox" value={props.todo.checked} />
			{props.todo.name}
		</div>
	)
}