import React, { useRef, useEffect } from 'react'

export default function DisplayFile(props) {
    const { audioStream, file, handleAudioReset, handleFormSubmission } = props
    const audioRef = useRef()

    // creates URL object for audio files
    useEffect(() => {
        if (!file && !audioStream) { return }
        if (file) {
            console.log('FILE', file)
            audioRef.current.src = URL.createObjectURL(file)
        } else {
            console.log('RECORDING', audioStream)
            audioRef.current.src = URL.createObjectURL(audioStream)
        }
    }, [audioStream, file])


    return (
        <main className='flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-full max-w-prose mx-auto'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>AI<span className='text-green-400 bold'>Interpreter</span></h1>
            <div className=' flex flex-col text-left my-4'>
                <h3 className='font-semibold'>{file ? 'File Name' : 'Your Recording'}</h3>
                <p className='truncate'>{file ? file?.name : ''}</p>
            </div>
            <div className='flex flex-col mb-2'>
                <audio ref={audioRef} className='w-full' controls>
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div className='flex items-center justify-between gap-4'>
                <button onClick={handleAudioReset} className='text-slate-400 hover:text-green-600 duration-200'>Reset</button>
                <button onClick={handleFormSubmission} className='button  px-3 p-2 rounded-lg text-green-400 flex items-center gap-2 font-medium '>
                    <p>Upload</p>
                    <i className="fa-solid fa-file-arrow-up"></i>
                </button>
            </div>
        </main>
    )
}