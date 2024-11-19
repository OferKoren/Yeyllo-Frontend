//frontend

//boardService
async function addActivity(activity) {
    return httpService.post(`board/${activity.boardId}/activity`, activity)
}

//boardActions
export async function updateBoard(board, activity = null) {
    try {

        if (activity) {
            try {
                await boardService.addActivity(activity) // Push the activity to the saved board's activities

            } catch (err) {
                console.error('Failed to add activity:', err)
            }
        }

        const { activities, ...boardWithoutActivities } = board

        const savedBoard = await boardService.save(boardWithoutActivities)
        store.dispatch(getCmdUpdateBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

//backend 

//board controller
export async function addActivity(req, res) {
    try {
        const activity = req.body
        const updatedBoard = await boardService.findByIdAndUpdate(activity.boardId, activity)

        res.json(updatedBoard)
    } catch (err) {
        console.error('Failed to add activity', err)
        res.status(500).send({ error: 'Failed to add activity' })
    }
}

//board service
async function findByIdAndUpdate(boardId, activity) {
    try {

        const collection = await dbService.getCollection('board')

        const criteria = { _id: ObjectId.createFromHexString(boardId) }
        await collection.updateOne(criteria, {
            $push: {
                activities: {
                    $each: [activity],
                    $position: 0
                }
            }
        })

    } catch (err) {
        console.error('Failed to update board', err)
        throw err
    }
}



