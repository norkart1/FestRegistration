import { RegistrationForm } from "@/components/registration-form";

export default function Registration() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-card-foreground mb-2">Student Registration</h2>
          <p className="text-muted-foreground">Please fill in all the required information to register for programs</p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
