import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }
  console.log("search",searchParams)

  return (
    <>
      <form className="flex flex-col w-full md:w-1/2 min-h-[80vh] gap-4 mx-auto p-6 md:px-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold">Regístrate</h1>
        {"success" in searchParams?
        <FormMessage message={searchParams} />
         :
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="name">Nombre</Label>
          <Input name="name" placeholder="Nombre Apellido" required />

          <Label htmlFor="phone">Teléfono</Label>
          <Input name="phone" placeholder="04120000000" required />
          
          <Label htmlFor="email">Correo</Label>
          <Input name="email" placeholder="you@example.com" required />
          
          <Label htmlFor="password">Contraseña</Label>
          <Input
            type="password"
            name="password"
            placeholder="tu contraseña"
            minLength={6}
            required
          />
         
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Registrate
          </SubmitButton>
          
          <p className="text-sm text text-foreground">
          Ya tienes una cuenta?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Iniciar sesión
          </Link>
          </p>
        </div>}
      </form>
      
    </>
  );
}
