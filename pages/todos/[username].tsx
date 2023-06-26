import { GetStaticPropsContext } from 'next';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  await new Promise(r => setTimeout(r, 5000))
  
  return {
    props: {
      username: context.params.username
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