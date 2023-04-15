import React, { MutableRefObject, useRef, useState } from "react"
import { api } from "../util/axios"

function PromptArtistry() {
    const imageInputRef: MutableRefObject<HTMLInputElement | null> =
        useRef(null)
    const [imageURL, setImageURL] = useState<string | null>(null)
    const [sentImage, setSentImage] = useState<boolean>(false)
    const [imagePending, setImagePending] = useState<boolean>(true)
    const [probability, setProbability] = useState<number>(0)
    const [prompt, setPrompt] = useState<string>("")
    const [timeTaken, setTimeTaken] = useState<number>(0)
    const [error, setError] = useState<boolean>(false)

    return (
        <div className="flex">
            <div className="flex basis-0 grow justify-center p-2">
                <div className="flex grow justify-center items-center rounded bg-stone-900 p-2 flex-col h-fit">
                    <label
                        htmlFor="image-input"
                        className="hover:shadow-sm hover:bg-sky-700 hover:scale-[1.01] hover:shadow-gray-500 transition-all rounded-full bg-sky-600 px-3 py-1 text-l font-semibold w-fit h-fit"
                    >
                        Upload Image
                    </label>
                    <input
                        ref={imageInputRef}
                        id="image-input"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onInput={() => {
                            const imageInput = imageInputRef.current
                            if (!imageInput) return
                            const imageFiles = imageInput.files
                            if (!imageFiles || imageFiles.length === 0) return
                            const imageFile = imageFiles[0]
                            setImageURL(URL.createObjectURL(imageFile))
                        }}
                    />
                    {imageURL && (
                        <>
                            <img className="m-2" src={imageURL} />
                            <button
                                className="hover:shadow-sm hover:bg-sky-700 hover:scale-[1.01] hover:shadow-gray-500 transition-all rounded-full bg-sky-600 px-3 py-1 text-l font-semibold w-fit h-fit"
                                onClick={() => {
                                    const imageInput = imageInputRef.current
                                    if (!imageInput) return
                                    const imageFiles = imageInput.files
                                    if (!imageFiles || imageFiles.length === 0)
                                        return
                                    const imageFile = imageFiles[0]
                                    const reader = new FileReader()
                                    reader.onload = () => {
                                        const dataURL = reader.result
                                        if (
                                            !dataURL ||
                                            typeof dataURL !== "string"
                                        )
                                            return
                                        const data = dataURL.slice(
                                            dataURL.indexOf(",") + 1
                                        )
                                        setSentImage(true)
                                        setImagePending(true)
                                        api.post("/prompt-artistry/submit", {
                                            image: data,
                                        })
                                            .then((resp) => {
                                                setProbability(
                                                    resp.data.probability
                                                )
                                                setPrompt(
                                                    resp.data.prompt || ""
                                                )
                                                setTimeTaken(resp.data.time)
                                                setImagePending(false)
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                setError(true)
                                                setImagePending(false)
                                            })
                                    }
                                    reader.readAsDataURL(imageFile)
                                }}
                            >
                                Submit!
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex basis-0 grow justify-center p-2">
                {sentImage && (
                    <div className="flex grow justify-center items-center rounded bg-stone-900 p-2 flex-col h-fit">
                        {imagePending ? (
                            <div className="animate-pulse">
                                AI is thinking...
                            </div>
                        ) : error ? (
                            <p className="font-semibold">
                                An error occurred. Please try again.
                            </p>
                        ) : (
                            <>
                                <h1 className="text-xl">
                                    This image is{" "}
                                    {probability < 0.5 ? (
                                        <text className="text-red-500 font-semibold">
                                            fake
                                        </text>
                                    ) : (
                                        <text className="text-green-500 font-semibold">
                                            real
                                        </text>
                                    )}
                                    !
                                </h1>
                                <p className="text-l">
                                    There is a{" "}
                                    <text className="font-semibold">
                                        {(probability * 100).toFixed(1)}%
                                    </text>{" "}
                                    chance that this image is real.
                                </p>
                                {prompt !== "" && (
                                    <p className="text-l text-center">
                                        A likely prompt is{" "}
                                        <i className="font-semibold">
                                            &quot;{prompt}&quot;
                                        </i>
                                    </p>
                                )}
                                <div className="h-2" />
                                <i className="text-sm text-stone-500">
                                    Result generated in {timeTaken.toFixed(3)}s
                                </i>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PromptArtistry
