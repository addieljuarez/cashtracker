export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
            <div className="bg-purple-950">

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
