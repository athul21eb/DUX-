import RegisterForm from '@/components/forms/RegisterForm';


function RegisterPage() {
  return (

      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-8">
            <div className="flex w-full max-w-prose flex-col gap-6">

              <RegisterForm />
            </div>
          </div>

  );
}

export default RegisterPage;
