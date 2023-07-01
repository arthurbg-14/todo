import { useRouter } from 'next/router'
import { useState } from 'react'
import Todo from '../../components/Todo'

export default function Todos() {
    const router = useRouter()
    let [todos, setTodos] = useState([])
    
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
      console.log('create')
    }

    getToDos()

  return (
    <>
      <div className="bg-lime-400 text-black w-full h-[100vh] flex items-center justify-center">
        <div className="bg-lime-600 p-2 rounded-md border-2 border-black shadow-[4px_4px_rgba(1,1,1,1)]">
          <div className="w-full my-4 flex items-center justify-end">
          <button onClick={createToDoHandler} className="bg-lime-400 w-[2.5rem] h-[2.5rem] mr-1 text-2xl font-bold rounded-full border-2 border-black shadow-[4px_4px_rgba(1,1,1,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">+</button>
          </div>
          {todos.map((todo, key) => (
            <Todo key={key} todo={todo}/>
          ))}
        </div>
      </div>
    </>
  )
}