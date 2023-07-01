import { useRouter } from 'next/router'
import { useState } from 'react'
import TodoComponent from '../../components/Todo'
import type { Todo } from '../../types/Todo'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

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
          console.log("apicall")
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
      <div className="bg-lime-400 text-black w-[100vw] h-[100vh] flex items-center justify-center">
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