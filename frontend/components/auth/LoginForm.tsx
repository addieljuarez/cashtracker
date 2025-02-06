'use client'
export default function LoginForm(){
    return(
        <>
            <form
                className="mt-14 space-y-5"
                noValidate
            >
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-2xl">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="email"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-2xl">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                    />
                </div>

                <input
                    type="submit"
                    value="Iniciar sesión"
                    className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer"
                />
            </form>
        </>
    )
}