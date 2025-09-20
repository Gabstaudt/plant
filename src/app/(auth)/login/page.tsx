import LoginForm from "@/app/components/auth/LoginForm";

export const metadata = { title: "Login — Plant" };

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid grid-cols-1 md:grid-cols-2">
      {/* Coluna visual (desktop) */}
      <aside className="relative hidden md:block">
        <img
          src="/login/loginimage.png"
          alt="Hands holding a seedling"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[var(--plant-ice)] [clip-path:ellipse(55%_80%_at_100%_50%)]"></div>
      </aside>

      {/* Coluna do formulário */}
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <p className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)]">
              We can heal our world.
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--plant-dark)] leading-tight">
              Plant Now!
            </h1>
          </header>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
