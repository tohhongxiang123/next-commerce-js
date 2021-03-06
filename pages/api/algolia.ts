import algoliasearch from "algoliasearch"
import { NextApiRequest, NextApiResponse } from "next"

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string, process.env.ALGOLIA_ADMIN_API_KEY as string)

const algoliaHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { event, payload } = req.body
    const [itemType, eventType] = event.split(".")
    const { id: objectID, ...product } = payload

    const index = client.initIndex(itemType)
    if (eventType === "delete") {
        await index.deleteObject(objectID)
        return res.status(202).end()
    }

    if (["create", "update"].includes(eventType)) {
        await index.saveObject({ objectID, id: objectID, ...product })
        return res.status(200).send({ success: true })
    }

    res.send({
        message: `Event type ${eventType} is not a valid trigger`,
    })
}

export default algoliaHandler