import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Login from '../components/Login'
import { useAddress } from '@thirdweb-dev/react'

const Home: NextPage = () => {

  const address = useAddress()
  
  if (!address) return <Login/>
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>The crypto lottery</title>
      </Head>
<Header/>    
</div>
  )
}

export default Home
