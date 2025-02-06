"use client"

import { register } from "@/actions/create-account-action"

export default function RegisterForm(){
    return(
        <form 
            className="mt-14 space-y-5"
            noValidate
            action={register}
        >
            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                    htmlFor="email" 
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email de registro"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="email"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold text-2xl">
                    Nombre
                </label>
                <input
                    type="name"
                    placeholder="Nombre de registro"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                >Contraseña</label>
                <input 
                    type="password"
                    placeholder="Contraseña de registro"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="password"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                >Repetir Contraseña</label>
                <input
                    id="password confirmation"
                    type="password"
                    placeholder="Repite contraseña de registro"
                    name="password_confirmation"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                />
            </div>

            <input
                type="submit"
                value="Registrarme"
                className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer block"
            />
        </form>
    )
}