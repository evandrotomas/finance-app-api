import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUSerUseCase {
    async execute(userId) {
        const postegresDeleteUserRepository = new PostgresDeleteUserRepository()

        const deletedUser = await postegresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
