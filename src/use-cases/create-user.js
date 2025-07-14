import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'

export class CreateUserUseCase {
    async excute(createUserParams) {
        // TODO: verificar se o e-mail ja esta em uso
        // Gerar ID do usuário
        const userdId = uuidv4()

        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
        // inserir o usuário o banco de dados
        const user = {
            ...createUserParams,
            id: userdId,
            password: hashedPassword,
        }

        // chamar o repositório
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.excute(user)

        return createdUser
    }
}
