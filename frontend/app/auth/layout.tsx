import Logo from "@/components/ui/Logo";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
            <div className="bg-purple-950 flex justify-center">
                <div className="w-96 py-10  lg:py-20">
                    <Logo />
                </div>
            </div>

            <div className="p-10 lg:py-28">
                <div className="max-w-3xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    </>
  );
}
