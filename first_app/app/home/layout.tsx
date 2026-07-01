import ClientWrapper from "../context/ClientContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <>
      <ClientWrapper>
        <main>{children}</main>
      </ClientWrapper>
     
    </>
        
  );
}