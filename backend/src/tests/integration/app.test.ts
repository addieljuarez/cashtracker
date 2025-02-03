import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'

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

        // console.log('response Auth: ', response.body.errors)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')
        
        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(createAccountMock).toHaveBeenCalledTimes(0)

    })
})