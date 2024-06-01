import React from 'react'

export default function HomePage(){
    return (
        <main className='flex-1 p-4 flex flex-col text-center gap-3 sm:gap-4 md:gap-5 justify-center'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>AI<span className='text-green-400 bold'>Scribe</span></h1>
            <h3 className='font-medium md:text-lg'>Record
                <span className='text-green-400'>&rarr;</span>Transcribe
                <span className='text-green-400'>&rarr;</span>Translate</h3>
        </main>
    )
}