import React, { useState, useEffect, useRef } from 'react'

export default function Home(props) {
    const { setAudioStream, setFile } = props

    const [recordingStatus, setRecordingStatus] = useState('Inactive')
    const [audioChunks, setAudioChunks] = useState([])
    const [duration, setDuration] = useState(0)

    const mediaRecorder = useRef(null)

    // setting media type for media recorder
    const mimeType = 'audio/webm'

    async function startRecording() {
        let currentStream
        console.log('Start recording')

        // accessing recording device
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            currentStream = streamData
        } catch (err) {
            console.log(err.message)
            return
        }

        setRecordingStatus('Recording')

        // establishing a media recorder
        const media = new MediaRecorder(currentStream, { type: mimeType })
        mediaRecorder.current = media
        mediaRecorder.current.start()
        
        // storing valid audio chunks in an array
        let currentAudioChunks = []
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') { return }
            if (event.data.size === 0) { return }
            currentAudioChunks.push(event.data)
        }
        setAudioChunks(currentAudioChunks)
    }

    async function stopRecording() {
        setRecordingStatus('Inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            // creates blob from array of chunks and resets
            const currentBlob = new Blob(audioChunks, { type: mimeType })
            setAudioStream(currentBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if (recordingStatus === 'Inactive') { return }

        // updates duration during recording
        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })


    return (
        <main className='flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4  justify-center pb-20'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>AI<span className='text-green-400 bold'>Interpreter</span></h1>
            <div id='slogan' className='font-medium md:text-lg'></div>
            <button onClick={recordingStatus === 'Recording' ? stopRecording : startRecording} className='flex button px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4'>
                <p className='text-green-400'>{recordingStatus === 'Inactive' ? 'Say something...' : `Stop recording`}</p>
                <div className='flex items-center gap-2'>
                    <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'Recording' ? ' text-rose-300' : "")}></i>
                </div>
            </button>
            <p className='text-base'><label className='text-green-400 cursor-pointer hover:text-green-600 duration-200'>Upload <input onChange={(e) => {
                const currentFile = e.target.files[0]
                setFile(currentFile)
            }} className='hidden' type='file' accept='.mp3,.wav' /></label> a file</p>
        </main>
    )
}