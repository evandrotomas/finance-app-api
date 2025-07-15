import { PostgreHelper } from '../../helpers/postgres-helper.js'

export class PostgresUpdateUser {
    async execute(userId, updateParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateParams[key])
        })

        updateValues.push(userId)

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id = $${updateFields.length}
            RETURNING *
        `

        const updateUser = await PostgreHelper.query(updateQuery, updateValues)

        return updateUser[0]
    }
}
