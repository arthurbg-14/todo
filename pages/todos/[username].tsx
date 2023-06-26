import { GetStaticPropsContext } from 'next';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps(context: any) {
  await new Promise(r => setTimeout(r, 5000))

  const username: string = context.params.username
  
  return {
    props: {
      username: username
    }
  }
}

type Props = {
  username: string
}

export default function Todos(props: Props) {
  return (
    <>
      <div className="bg-lime-400 text-black w-[100vw] h-[100vh] flex flex-col items-center justify-center relative">
        Hello {props.username}
      </div>
    </>
  )
}