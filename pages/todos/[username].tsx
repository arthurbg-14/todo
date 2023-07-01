import { useRouter } from 'next/router'
import { useState } from 'react'
import TodoComponent from '../../components/Todo'
import type { Todo } from '../../types/Todo'
import type {
  GetStaticProps,
  GetStaticPaths,
  GetStaticPropsContext,
} from 'next'
 
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: {
        username: "bolsonaro"
      }}
    ],
    fallback: true,
  }
}
 
export const getStaticProps: GetStaticProps<{
  todos: Todo[]
}> = async (context: any) => {
  const res = await fetch('https://'+process.env.VERCEL_URL+'/api/todos?username='+context.params.username)
  const json = await res.json()

  return { props: { todos: json.todos } }
}

export default function Page(props: {todos: Todo[]}) {
    const router = useRouter()
    let [todos, setTodos] = useState<Todo[]>(props.todos)
    
    if (!router.query.username) {
      return
    }

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