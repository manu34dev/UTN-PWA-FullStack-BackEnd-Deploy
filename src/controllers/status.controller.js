import ResponseBuilder from "../utils/builders/responseBuilder.js"

export const getPingController = (req, res) => {
    try {
        const response = new ResponseBuilder()
        .setOk (true)
        .setMessage ("success")
        .setStatus (200)
        .setPayload ({
            message: "pong"
        })
        .build() 
        res.status(200).json(response)
    } catch (error) {
        const response = new ResponseBuilder()
        .setOk (false)
        .setMessage ("internal server error")
        .setStatus (500)
        .setPayload ({
            detail: error.message
        })
        .build()
        res.status(500).json(response)
    }
}
