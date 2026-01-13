import "../styles/globals.css";

export const metadata = {
  title: "Nimbus Tasks",
  description: "Nimbus Tasks — a polished task system with a guided wizard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
