import { CreateUserUseCase } from '../use-cases/create-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
} from './helpers/index.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            // validar a requisição (campos obrigatórios,tamanho de senha e e-mail)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length == 0) {
                    return badRequest({ messaeg: `Missing param: ${field}` })
                }
            }

            // validação password: verificar se password é menor que 6
            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            // validação de e-mail
            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse()
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.excute(params)

            // retornar a resposta para o usuário (status code)
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
