import React from 'react'

export default function Loading(props) {
    const { downloading } = props


    return (
        <div className='flex items-center flex-1 flex-col justify-center gap-10 md:gap-14 text-center pb-24 p-4'>
            <div className='flex flex-col gap-2 sm:gap-4'>

                <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'><span className='text-green-400 bold'>Loading...</span></h1>
            </div>
            <div className="w-12 h-12 rounded-full animate-spin border-8 border-dashed border-green-500 border-t-transparent"></div>
        </div>
    )
}