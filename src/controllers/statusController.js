
const Request = require('../models/requestModel');

/**
 * Retrieves the status and output images associated with a given requestId.
 *
 * @param {Object} req - The request object from the client (Express.js request object).
 * @param {Object} res - The response object to send JSON data or error messages (Express.js response object).
 * @returns {Promise<void>} Responds with JSON containing requestId, status, and outputImages array.
 *                          Throws sarcastic errors when things inevitably go wrong.
 * @throws {400} When you forget the requestId (because clearly, mind-reading is not supported yet).
 * @throws {404} If the requests decided to take a spontaneous vacation or just don't exist.
 * @throws {500} If something goes terribly wrong internally (because it's never your fault, right?).
 *
 * @example
 * GET /api/status/12345
 * Response: JSON data containing requestId, status, and output images, or an entertaining error.
 */
const getStatus = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({ error: "Request ID is required" });
        }

        const requests = await Request.find({ requestId });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ error: "Requests not found" });
        }

        res.status(200).json(
            requests.map(request => ({
                requestId: request.requestId,
                status: request.status,
                outputImages: request.outputImages || [],
            }))
        );

    } catch (error) {
        console.error(" Error retrieving status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getStatus };
