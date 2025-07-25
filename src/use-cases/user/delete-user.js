export class DeleteUSerUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
