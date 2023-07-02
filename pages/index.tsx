import { useRouter } from 'next/router';
import { useState } from 'react';
import { MouseEvent } from 'react';
import { ChangeEvent } from 'react';

export default function Home(props: any) {  
  const router = useRouter();

  let username: string = ""
  const [error, setError] = useState("")

  function handleChange(e: ChangeEvent<HTMLInputElement>){
    username = e.target.value
  }
  function handleClick(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>){
    if (!username) {
      setError("Choose a username")
      return
    }

    const target = e.target as Element

    target.innerHTML = "Loading"
    router.push(`/todos/${username.toLowerCase()}`)
  }

  return (
    <>
      <div className="bg-lime-400 text-black w-[100vw] h-[100vh] flex flex-col items-center justify-center relative">
        <input className="p-2 border-2 rounded border-black shadow-[4px_4px_rgba(1,1,1,1)]" type="text" placeholder="Username" onChange={handleChange}/>
        <span className="mt-2 text-red-700 text-md font-bold">{error}</span>
        <button onClick={handleClick}
        className="mt-5 border-2 p-2 bg-lime-600 hover:bg-lime-700 rounded border-black shadow-[4px_4px_rgba(1,1,1,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">Enter</button>
      </div>  
    </>
  )
}