import { createRequest, createResponse } from "node-mocks-http"
import { AuthController } from "../../../controllers/AuthController"
import User from "../../../models/User"

describe('controller - AuthController - login', () => {
    it('should handle error create user controller and return 409 status', async() => {
        User.findOne = jest.fn().mockResolvedValue(true)
       
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body:{
                email: 'test@gmail.com',
                password: '12345678',
            }
        })
        const res = createResponse()
        User.create = jest.fn().mockResolvedValue(req.body)
        await AuthController.createAccount(req, res)

        expect(res.statusCode).toBe(409)
        expect(User.create).not.toHaveBeenCalled()
        expect(User.create).toHaveBeenCalledTimes(0)
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(res._getJSONData()).toEqual({
            error: 'El usuario ya existe'
        })
    })

    // it('should handle create user controller', async() => {
    //     const req = createRequest({
    //         body:{
    //             email: 'test@gmail.com',
    //             password: '12345678',
    //         }
    //     })
    //     const res = createResponse()
    //     User.findOne = jest.fn().mockResolvedValue(null)
    //     User.create = jest.fn().mockResolvedValue(req.body)
    //     await AuthController.createAccount(req, res)

    //     expect(res.statusCode).toBe(200)
    //     // expect

    // })
})