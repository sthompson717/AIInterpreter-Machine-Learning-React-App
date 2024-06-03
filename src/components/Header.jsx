import React from 'react'

export default function Header() {
    return (
        <header className='flex items-center text-lg justify-between gap-4 p-6'>
            <a href="/"><h1 className='font-medium'>AI<span className='text-green-400 bold'>Interpreter</span></h1></a>
        </header>
    )
}