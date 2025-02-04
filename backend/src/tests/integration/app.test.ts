import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'

describe('TEST', () => {

    beforeEach(async() => {
        await connectDB()
    })
    it('should return a 200 status code from the homepage url', async () => {
        const response = await request(server).get('/')
        console.log('response///', response.statusCode)
        console.log('response///', response.text)

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

        console.log('response Auth: ', response.body.errors[0].msg)
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

        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id:1,
                confirmed: true,
                password: '12345678',
                email: 'test@gmail.com'
            })
        

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: '1234567890'
            })
        
        console.log('auth login--', response.body)
        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password inconrrecto')
    })
})