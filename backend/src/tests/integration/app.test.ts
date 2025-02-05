import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'
import * as authUtils from '../../utils/auth'
import * as authToken from '../../utils/jwt'

describe('TEST', () => {

    beforeEach(async() => {
        await connectDB()
    })
    it('should return a 200 status code from the homepage url', async () => {
        const response = await request(server).get('/')
        // console.log('response///', response.statusCode)
        // console.log('response///', response.text)

        expect(response.statusCode).toBe(200)
        expect(response.text).toBe('API is running')
    })
    
})

describe('Authentication - Create', () => {
    it('should display validation errors when form is empty', async() => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({})

        // console.log('response Auth: ', response.body.errors)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(createAccountMock).toHaveBeenCalledTimes(0)
    })

    it('should return 400 when the email is invalid', async() => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({
                name: 'name',
                password: '12345678',
                email: 'testNotValidateEmail'
            })

        // console.log('response Auth: ', response.body.errors)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(createAccountMock).toHaveBeenCalledTimes(0)

    })

    it('should return 400 when the password is not lenght', async() => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({
                name: 'name',
                password: '12345',
                email: 'test@gmail.com'
            })

        // console.log('response Auth: ', response.body.errors[0].msg)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(createAccountMock).toHaveBeenCalledTimes(0)
        expect(response.body.errors[0].msg).toBe('El password es muy corto, minimo 8 carcateres')

    })

    it('should return 200 when all is ok and create account', async() => {

        const userData = {
            name: 'name',
            password: '12345678',
            email: 'test1@gmail.com'
        }
        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        
        expect(response.status).toBe(201)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
        
        
    })


    it('should return 409 when user already register', async() => {

        const userData = {
            name: 'name',
            password: '12345678',
            email: 'test1@gmail.com'
        }
        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        
        // console.log('response.body', response.body)
        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        // expect(AuthController.createAccount).toHaveBeenCalled()
        // expect(AuthController.createAccount).toHaveBeenCalledTimes(1)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('Authentication - Account confirmation code', () => {
    it('should display error if token is empty', async() => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({})

        // console.log('Authentication - Account confirmation code', response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
    })

    it('should display error when token is invalid', async() => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                token: '123456'
            })

        // console.log('Authentication - Account confirmation code', response.body)
        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.statusCode).not.toBe(200)
        // expect(response.body.errors).toHaveLength(2)
    })



    it('should display error when token is valid', async() => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                token: `${globalThis.cashTrackerToken}`
            })

        // console.log('globalThis', globalThis.cashTrackerToken)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBe('cuenta confirmada correctamente')
    })
})

describe('auth - login', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should display validation errors when the form is empty', async() => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({})

        const mockLogin = jest.spyOn(AuthController, 'login')
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
        expect(mockLogin).not.toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledTimes(0)

    })

    it('should display validation errors when email is not valid', async() => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test_email_not_valid',
                password: '12345678'
            })

        const mockLogin = jest.spyOn(AuthController, 'login')
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Email no valido')
        expect(response.body.errors).toHaveLength(1)
        expect(mockLogin).not.toHaveBeenCalled()
        expect(mockLogin).toHaveBeenCalledTimes(0)

    })

    it('should display validation errors when email not exists', async() => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test2@gmail.com',
                password: '12345678'
            })
        
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no encontrado')
    })

    it('should display validation errors when account is not confimed', async() => {

        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id:1,
                confirmed: false,
                password: '12345678',
                email: 'test@gmail.com'
            })
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: '12345678'
            })
        
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
    })

    it('should display validation errors when account is not confimed part 2', async() => {

        const userData = {
            name: 'testNC',
            password: '12345678',
            email: 'test3@gmail.com'
        }

        await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            })
        
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
    })

    it('should display validation errors when password is bad', async() => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id:1,
                confirmed: true,
                password: '12345678',
                email: 'test@gmail.com'
            })
        
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false)
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: '1234567890'
            })
        
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password incorrecto')
        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalled()
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it('should display validation errors when all is ok and return 200', async() => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id:1,
                confirmed: true,
                password: 'hashpassword',
                email: 'test5@gmail.com'
            })
        
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)
        const generateJWT = jest.spyOn(authToken, 'generateJWT').mockReturnValue('jwt_token_mock')
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test5@gmail.com',
                password: 'correctpassword'
            })
        
        // console.log('auth login--', response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('user')
        expect(response.body).toHaveProperty('token')
        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalled()
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalled()
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(response.body.token).toEqual('jwt_token_mock')
        expect(checkPassword).toHaveBeenCalledWith('correctpassword', 'hashpassword')
    })
})


// auth global
let jwt: string

async function authenticationUser() {
    const response = await request(server)
        .post('/api/auth/login')
        .send({
            email: 'test1@gmail.com',
            password: '12345678'
        })
    
    jwt = response.body.token
    // console.log('response login token: ', jwt)
    expect(response.statusCode).toBe(200)
}

// Budgets
describe('GET /api/budgets', ()=> {

    // let jwt: string

    beforeAll(() => {
        jest.restoreAllMocks() // restaura las funciones de los jest.spy a su implementacion original
    })
    beforeAll(async() => {

        //     const response = await request(server)
        //         .post('/api/auth/login')
        //         .send({
        //             email: 'test1@gmail.com',
        //             password: '12345678'
        //         })
            
        //     jwt = response.body.token
        //     // console.log('response login token: ', jwt)
        //     expect(response.statusCode).toBe(200)

        await authenticationUser()
    })


    it('should reject unauthenticated access to budgets without a jwt', async() => {
        const response = await request(server)
            .get('/api/budgets')

        // console.log('/api/budgets', response.body)

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: 'No autorizado'
        })
    })

    it('should reject unauthenticated access to budgets without a viad jwt', async() => {
        const response = await request(server)
            .get('/api/budgets')
            .auth('jwt_not_valid', {type: 'bearer'})

        // console.log('/api/budgets', response.body)

        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            error: 'Token no valido en user'
        })
    })

    it('should success access to budgets with a jwt', async() => {
        const response = await request(server)
            .get('/api/budgets')
            .auth(jwt, {type: 'bearer'})

        // console.log('/api/budgets', response.body)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
    })
})

describe('POST /api/budgets', () => {
    beforeAll(async() => {
        await authenticationUser()
    })

    it('should reject unathenticated post request to budget withouth a jwt', async() => {
        const response = await request(server)
            .post('/api/budgets')

        // console.log(response.body)
        expect(response.statusCode).toBe(401)
        expect(response.body).toEqual({
            error: 'No autorizado'
        })
    })

    it('should reject unathenticated post request to budget with a invalid jwt', async() => {
        const response = await request(server)
            .post('/api/budgets')
            .auth('invalid_jwt', {
                type: 'bearer' 
            })

        // console.log(response.body)
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual({
            error: 'Token no valido en user'
        })
    })

    it('should display validation when the form is submitted with a invalid data', async() => {
        const response = await request(server)
            .post('/api/budgets')
            .auth(jwt, {
                type: 'bearer'
            })
            .send({})
        
        // console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
    })

    it('should display validation when the form is submitted with a valid data', async() => {
        const response = await request(server)
            .post('/api/budgets')
            .auth(jwt, {
                type: 'bearer'
            })
            .send({
                name: 'budget test',
                amount: 1000
            })
        
        console.log(response.body)
        expect(response.statusCode).toBe(201)
        expect(response.body).not.toHaveProperty('errors')
        expect(response.body).toEqual({
            respuesta: 'creado correctamente'
        })
    })
})

describe('GET /api/budgets/:id', () => {
    beforeAll(async() => {
        await authenticationUser()
    })

    it('should reject unauthenticated get request to budget id without a jwt', async() => {
        const response = await request(server)
            .get('/api/budgets/1')

        // console.log('get budget Id:', response.body)
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: 'No autorizado'
        })
    })

    it('should return 400 bad request when id is not valid', async() => {
        const response = await request(server)
            .get('/api/budgets/not_valid')
            .auth(jwt, {
                type: 'bearer'
            })

        // console.log('get budget Id:', response.body)
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(401)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        expect(response.body.errors).toBeTruthy()
    })


    it('should return error when id not exists', async() => {
        const response = await request(server)
            .get('/api/budgets/10')
            .auth(jwt, {
                type: 'bearer'
            })

        // console.log('get budget Id:', response.body)
        expect(response.status).toBe(404)
        expect(response.status).not.toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Budget no encontrado')
    })

    it('should return 200 when id exists', async() => {
        const response = await request(server)
            .get('/api/budgets/1')
            .auth(jwt, {
                type: 'bearer'
            })

        // console.log('get budget Id:', response.body)
        expect(response.status).toBe(200)
    })

    it('should handle update a budget by ID', async() => {
        const response = await request(server)
            .put('/api/budgets/1')
            .send({
                name: 'update budget test',
                amount: 1500
            })
            .auth(jwt, {
                type: 'bearer'
            })

        // console.log('get budget Id:', response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            status: 'budget actualizado'
        })
    })

    // it('should handle delete a budget by ID', async() => {
    //     const response = await request(server)
    //         .delete('/api/budgets/1')
    //         .auth(jwt, {
    //             type: 'bearer'
    //         })

    //     // console.log('get budget Id:', response.body)
    //     expect(response.status).toBe(200)
    //     expect(response.body).toEqual({
    //         status: "Budget Eliminado"
    //     })
    // })
})