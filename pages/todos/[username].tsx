import { useRouter } from 'next/router'
import { useState } from 'react'
import type { Todo } from '../../types/Todo'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import { ChangeEvent } from 'react'
import debounce from "lodash.debounce"

export const getServerSideProps: GetServerSideProps<{
  todos: Todo[]
}> = async (ctx) => {

  if (typeof ctx.query.username != "string"){
    return {redirect: {
      destination: '/',
      permanent: false,
    },}
  }

  const prisma = new PrismaClient()

  const todos = await prisma.todo.findMany({
		where: {createdBy:{equals: ctx.query.username}},
		orderBy: [
				{
					name: 'desc',
				},
			]
		})

  return { props: { todos: JSON.parse(JSON.stringify(todos))} }
}


export default function Page(props: {todos: Todo[]}) {
    const router = useRouter()
    
    let [todos, setTodos] = useState<Todo[]>(props.todos)

    if (!router.query.username){return}

    function getToDos(){
      fetch('/api/todos?username=' + router.query.username).then(res => {
        res.json().then(json => {
          setTodos(json.todos)
        })
      })
    }

    function createToDoHandler(){
      if(typeof router.query.username != "string"){return}

      setTodos([...todos, {name:"",data:"",checked:false,createdBy: router.query.username}])

      fetch('/api/todos/new', {
        method: "POST",
        body: JSON.stringify({
          createdby: router.query.username
        })
      }).then(res => getToDos())
    }

  return (
    <>
      <div className="bg-lime-400 text-black w-[100vw] h-full min-h-[100vh] flex items-center justify-center">
        <div className="bg-lime-600 min-w-[24rem] p-2 rounded-md border-2 border-black shadow-[4px_4px_rgba(1,1,1,1)]">
          <div className="w-full my-4 flex items-center justify-end">
          <button onClick={createToDoHandler} className="bg-lime-400 w-[2.5rem] h-[2.5rem] mr-1 text-2xl font-bold rounded-full border-2 border-black shadow-[4px_4px_rgba(1,1,1,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">+</button>
          </div>
          {
          todos.map((todo, key) => (
            <TodoComponent key={key} todo={todo} updateToDos={getToDos}/>
          ))
          }
        </div>
      </div>
    </>
  )
}

export function TodoComponent(props: {todo: Todo, updateToDos: Function}) {
	const [name, setName] = useState(props.todo.name)

	function editToDo(element: HTMLElement, newTodo: object) {
		const id: string | undefined = element.id.replace("todo-", "")

		fetch("/api/todos/edit/" + id, {
			method: "PUT",
			body: JSON.stringify(newTodo)
		})
	}

	function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
		const element = e.target.parentElement?.parentElement	

		if(!element){return}

		editToDo(element, {checked:e.target.checked})
	}

	function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
		const element = e.target.parentElement	

		if(!element){return}

		setName(e.target.value)

		editToDo(element, {name: e.target.value})
	}

	function handleDelete(e: any)  {
		const element: HTMLElement = e.target.parentElement?.parentElement
		const id: string | undefined = element.id.replace("todo-", "")

		fetch("/api/todos/delete/" + id, {
			method: "DELETE"
		})

    element.remove()
	}

	return (
		<div id={`todo-${props.todo.id}`} className="bg-lime-400 group hover:bg-lime-500 flex items-center p-2 mb-3 rounded font-bold border-2 border-black shadow-[4px_4px_rgba(1,1,1,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
			<div className="relative flex items-center justify-center w-6 h-6">
				<input type="checkbox" defaultChecked={props.todo.checked} onChange={handleCheckboxChange}
				className="cursor-pointer appearance-none border-lime-600 border-2 w-6 h-6 rounded absolute peer"/>
				<CheckIcon/>
			</div>
			<input className="w-full mx-2 bg-lime-400 group-hover:bg-lime-500" type="text" onChange={debounce(handleChangeName, 1000)} defaultValue={name}/>
			<button className="h-6 hover:bg-lime-400 rounded" onClick={handleDelete}>
				<TrashIcon/>
			</button>
		</div>
	)
}

function CheckIcon() {
  return (
    <svg className="peer-checked:block hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41L9 16.17z"></path></svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
  )
}