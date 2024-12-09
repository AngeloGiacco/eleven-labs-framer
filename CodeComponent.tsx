// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/

import React from "react"
import { addPropertyControls, ControlType } from "framer"

// Add this declaration at the top of your file or in a separate declaration file
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "elevenlabs-convai": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >
        }
    }
}

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/components/auto-sizing
 *
 * @framerIntrinsicWidth 2
 * @framerIntrinsicWidth 2
 */
export default function ConversationalAI(props) {
    // This React component integrates the Eleven Labs Conversational AI widget
    // The widget script handles styling and positioning (e.g., bottom-right hover preview)

    React.useEffect(() => {
        // Dynamically add the external script
        const script = document.createElement("script")
        script.src = "https://elevenlabs.io/convai-widget/index.js"
        script.async = true
        script.type = "text/javascript"
        document.body.appendChild(script)

        // Cleanup the script on component unmount
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div style={containerStyle}>
            <elevenlabs-convai agent-id={props.agentId}></elevenlabs-convai>
        </div>
    )
}

addPropertyControls(ConversationalAI, {
    agentId: {
        type: ControlType.String,
        title: "Agent ID",
        description:
            "Find the agent id at [elevenlabs.io](https://elevenlabs.io/app/conversational-ai/)",
    },
})

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
}
