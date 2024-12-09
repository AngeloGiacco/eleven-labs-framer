import { framer } from "framer-plugin"
import { useState, useEffect } from "react"
import "./App.css"

framer.showUI({
    position: "top right",
    width: 350,
    height: 250,
})

const AGENT_START_MARKER = "<!-- Conversational AI Agent Start -->"
const AGENT_END_MARKER = "<!-- Conversational AI Agent End -->"

export function App() {

    const [agentId, setAgentId] = useState<string>("")
    const [isAgentLoaded, setIsAgentLoaded] = useState<boolean>(false)

    useEffect(() => {
        // Initial check when the component mounts
        checkAgentLoadStatus()

        // Subscribe to canvas root changes (page navigations)
        const unsubscribe = framer.subscribeToCanvasRoot(() => {
            checkAgentLoadStatus()
        })

        // Cleanup the subscription when the component unmounts
        return () => {
            unsubscribe()
        }
    }, [])

    const handleInsertSnippet = async () => {
        if (!agentId.trim()) {
            framer.notify("Agent ID cannot be empty", { variant: "error" })
            return
        }

        const snippet = `
            ${AGENT_START_MARKER}
            <elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
            <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
            ${AGENT_END_MARKER}
        `

        try {
            await framer.setCustomCode({
                html: snippet,
                location: "bodyEnd",
            })
            framer.notify("Convai Widget inserted successfully!", { variant: "success" })
            setIsAgentLoaded(true)
        } catch (error) {
            framer.notify("Failed to insert Convai Widget.", { variant: "error" })
            console.error(error)
        }
    }

    const handleRemoveSnippet = async () => {
        try {
            const currentCustomCode = await framer.getCustomCode()

            const bodyEndHtml = currentCustomCode.bodyEnd.html

            if (bodyEndHtml && bodyEndHtml.includes(AGENT_START_MARKER)) {
                // Remove the conversational AI snippet by excluding it
                const updatedHtml = bodyEndHtml.replace(
                    new RegExp(`${AGENT_START_MARKER}[\\s\\S]*?${AGENT_END_MARKER}`),
                    ""
                )

                await framer.setCustomCode({
                    html: updatedHtml.trim() || null, // Set to null if empty after trimming
                    location: "bodyEnd",
                })
                framer.notify("Convai Widget removed successfully!", { variant: "success" })
                setIsAgentLoaded(false)
            } else {
                framer.notify("No Convai Widget found to remove.", { variant: "info" })
            }
        } catch (error) {
            framer.notify("Failed to remove Convai Widget.", { variant: "error" })
            console.error(error)
        }
    }

    const checkAgentLoadStatus = async () => {
        try {
            const currentCustomCode = await framer.getCustomCode()
            const bodyEndHtml = currentCustomCode.bodyEnd.html

            if (bodyEndHtml && bodyEndHtml.includes(AGENT_START_MARKER)) {
                setIsAgentLoaded(true)
            } else {
                setIsAgentLoaded(false)
            }
        } catch (error) {
            framer.notify("Error checking agent load status.", { variant: "error" })
            console.error("Error checking agent load status:", error)
        }
    }

    return (
        <main className="flex flex-col items-start p-4 h-full gap-4">
            {isAgentLoaded ? (
                <div className="bg-white rounded-lg p-6 shadow-md w-full box-border">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <h3 className="m-0 text-lg font-semibold text-gray-800">Active Conversational Agent</h3>
                    </div>
                    <div className="mb-4">
                        <p>Agent ID: <a 
                            href={`https://elevenlabs.io/app/conversational-ai/${agentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                        >
                            {agentId}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </a></p>
                    </div>
                    <button 
                        className="w-full py-3 bg-red-100 text-red-600 rounded-lg font-medium transition-all hover:bg-red-200 flex items-center justify-center"
                        onClick={handleRemoveSnippet}
                    >
                        Remove Agent
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-6 shadow-md w-full box-border">
                    <h3 className="m-0 text-lg font-semibold text-gray-800">No Conversational AI agent found</h3>
                    <p className="mt-2 text-sm text-gray-600">Add conversational agent</p>
                    <input
                        type="text"
                        placeholder="Enter Agent ID"
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm transition focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <button 
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        onClick={handleInsertSnippet}
                        disabled={!agentId.trim()}
                    >
                        Insert Agent
                    </button>
                    <a 
                        href="https://elevenlabs.io/app/conversational-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4 text-center text-blue-600 hover:underline font-medium"
                    >
                        Create a conversational AI agent →
                    </a>
                </div>
            )}
        </main>
    )
}
