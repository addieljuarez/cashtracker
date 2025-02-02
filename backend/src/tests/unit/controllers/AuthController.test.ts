import { createRequest, createResponse } from "node-mocks-http"
import { AuthController } from "../../../controllers/AuthController"
import User from "../../../models/User"
import AuthEmail from "../../../emails/AuthEmail"

describe('controller - AuthController - login', () => {

    beforeEach(() => {
        User.findOne = jest.fn().mockReset()
        User.create = jest.fn().mockReset()
    })

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

    it('should handle create user controller', async() => {
        const req = createRequest({
            body:{
                email: 'test@gmail.com',
                password: '12345678',
                name: 'test'
            }
        })
        const res = createResponse()

        const mockUser = {
            ...req.body,
            save: jest.fn()
        }
        
        User.findOne = jest.fn().mockResolvedValue(false)
        User.create = jest.fn().mockResolvedValue(mockUser)
        jest.mock("../../../utils/auth", () => ({
            hashPassword: jest.fn().mockResolvedValue('haspassword')
        }));
        jest.mock("../../../utils/token", () => ({
            generateToken: jest.fn().mockReturnValue('123456')
        }));
        

        // to send email
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve())

        await AuthController.createAccount(req, res)

        expect(res.statusCode).toBe(201)
        expect(res._getJSONData()).toEqual({
            status: 'Cuenta creada',
            response: mockUser.save()
        })
        expect(User.create).toHaveBeenCalled()
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(User.create).toHaveBeenCalledWith(req.body)
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalled()
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockUser.save).toHaveBeenCalledTimes(2)
    })
})


describe('controller - AuthController - login', () => {
    it('should handle login when user not exists', async() => {
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'test@gmail.com',
                password: '12345678'
            }
        })
        const res = createResponse()

        User.findOne = jest.fn().mockResolvedValue(false)
        await AuthController.login(req, res),

        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toHaveProperty('error', 'Usuario no encontrado')
        expect(res._getJSONData()).toEqual({
            error: 'Usuario no encontrado'
        })
    })
})