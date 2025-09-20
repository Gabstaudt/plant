import RegisterForm from "@/app/components/auth/RegisterForm";

export const metadata = { title: "Register — Plant" };

export default function RegisterPage() {
  return (
    <main className="min-h-dvh grid grid-cols-1 md:grid-cols-2">
     
      <aside className="relative hidden md:block">
        <img
          src="/login/loginimage.png"
          alt="Hands holding a seedling"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[var(--plant-ice)] [clip-path:ellipse(55%_80%_at_100%_50%)]"></div>
      </aside>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--plant-dark)] leading-tight">
              Crie sua conta!
            </h1>
            <p className="mt-1 text-[var(--plant-graphite)]/80">
              Junte-se e <strong>Monitore suas Plantas!</strong>
            </p>
          </header>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
