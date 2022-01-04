
module.exports = {
    OK:(res, message = 'OK') => {
        return res.status(200).json({ message })
    },

    CREATED:(res, message = 'Created') => {
        return res.status(201).json({ message })
    },

    BAD_REQUEST:(res, error = 'Bad Request') => {
        return res.status(400).json({ error })
    },

    SERVER_ERROR:(res, error = "Internal Server Error") => {
        return res.status(500).json({ error })
    }
}