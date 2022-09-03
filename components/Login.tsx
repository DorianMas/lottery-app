import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'

function Login() {

    const connectWithMetaMask = useMetamask();

    return (
        <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
            <div className='flex flex-col items-center mb-10'>
                <img className="rounded-full h-36 wo-36 mb-10" src='https://avatars.githubusercontent.com/u/96738909?s=96&v=4' />
                <h1 className='text-6xl text-white font-bold mb-5'>Lottery App</h1>
                <p className='text-white'>Get Started By loggin in with your MetaMask</p>
                <button onClick={connectWithMetaMask} className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Login with MetaMask</button>
            </div>
        </div>
    )
}

export default Login