import request from 'supertest'
import server, { connectDB } from '../../server'


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
    it('should displkay validation errors when form is empty', async() => {
        const response = await request(server)
            .post('/api/auth/create-account')
            .send({})

        // console.log('response Auth: ', response.body.errors)

        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
    })
})