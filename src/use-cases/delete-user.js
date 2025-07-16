export class DeleteUSerUseCase {
    constructor(postgresDeleteUserRepository) {
        this.postgresDeleteUserRepository = postgresDeleteUserRepository
    }

    async execute(userId) {
        const deletedUser =
            await this.postgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
