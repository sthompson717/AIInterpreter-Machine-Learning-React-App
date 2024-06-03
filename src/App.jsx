import { useState, useRef, useEffect } from 'react'
import Home from './components/Home'
import Header from './components/Header'
import DisplayFile from './components/DisplayFile'
import DisplayText from './components/DisplayText'
import Loading from './components/Loading'
import { MessageTypes } from './utils/presets'

export default function App() {
  // handling recordings and uploaded files
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)

  // handling states for uploading and downloading
  const [output, setOutput] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  // boolean flag if any audio has been received
  const isAudioAvailable = file || audioStream

  // reference state for worker instance
  const worker = useRef(null)

  useEffect(() => {
    // only create new worker if one does not already exist
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/transcriber.js', import.meta.url), {
        type: 'module'
      })
    }

    // changes states according to event messages
    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('DOWNLOADING')
          break;
        case 'LOADING':
          setLoading(true)
          console.log('LOADING')
          break;
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results)
          break;
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log("DONE")
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  })

  // decodes audio files into PCM data
  async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCXT = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCXT.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  // deletes files on reset
  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }


  async function handleFormSubmission() {
    if (!file && !audioStream) { return }

    // if there is audio, send to decoder
    let audio = await readAudioFrom(file ? file : audioStream)

    // sends inference request message
    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio
    })
  }

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='flex flex-col min-h-screen'>
        <Header />
        {output ? (
          <DisplayText output={output} finished={finished} handleAudioReset={handleAudioReset}/>
        ) : loading ? (
          <Loading/>
        ) : isAudioAvailable ? (
          <DisplayFile handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <Home setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer></footer>
    </div>
  )
}