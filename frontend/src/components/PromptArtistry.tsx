import React, { MutableRefObject, useRef, useState } from "react"
import { api } from "../util/axios"

function PromptArtistry() {
    const imageInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const [imageURL, setImageURL] = useState<string | null>(null)
    const [sentImage, setSentImage] = useState<boolean>(true)
    const [imagePending, setImagePending] = useState<boolean>(true)

    return (
        <div className="flex">
            <div className="flex basis-0 grow justify-center p-2">
                <div className="flex grow justify-center items-center rounded bg-stone-900 p-2 flex-col h-fit">
                    <label htmlFor="image-input" className="hover:shadow-sm hover:bg-sky-700 hover:scale-[1.01] hover:shadow-gray-500 transition-all rounded-full bg-sky-600 px-3 py-1 text-l font-semibold w-fit h-fit">
                        Upload Image
                    </label>
                    <input ref={imageInputRef} id="image-input" type="file" accept="image/png, image/jpeg" className="hidden" onInput={
                        () => {
                            const imageInput = imageInputRef.current
                            if (!imageInput) return
                            const imageFiles = imageInput.files
                            if (!imageFiles || imageFiles.length === 0) return
                            const imageFile = imageFiles[0]
                            setImageURL(URL.createObjectURL(imageFile))
                        }
                    }/>
                    {imageURL && <>
                        <img className="m-2" src={imageURL} />
                        <button 
                            className="hover:shadow-sm hover:bg-sky-700 hover:scale-[1.01] hover:shadow-gray-500 transition-all rounded-full bg-sky-600 px-3 py-1 text-l font-semibold w-fit h-fit"
                            onClick={
                                () => {
                                    const imageInput = imageInputRef.current
                                    if (!imageInput) return
                                    const imageFiles = imageInput.files
                                    if (!imageFiles || imageFiles.length === 0) return
                                    const imageFile = imageFiles[0]
                                    const reader = new FileReader()
                                    reader.onload = () => {
                                        const dataURL = reader.result
                                        if (!dataURL || typeof dataURL !== "string") return
                                        const data = dataURL.slice(dataURL.indexOf(",") + 1)
                                        setSentImage(true)
                                        setImagePending(true)
                                        api.post("/prompt-artistry/submit", {
                                            "image": data
                                        }).then((resp) => {
                                            console.log(resp)
                                            setImagePending(false)
                                        })
                                    }
                                    reader.readAsDataURL(imageFile)
                                }
                            }
                        >Submit!</button>
                    </>}
                </div>
            </div>
            <div className="flex basis-0 grow justify-center p-2">
                {sentImage && <div className="flex grow justify-center items-center rounded bg-stone-900 p-2 flex-col h-fit">
                    {imagePending && <div className="animate-pulse">AI is thinking...</div>}
                </div>}
            </div>
        </div>
    )
}

export default PromptArtistry