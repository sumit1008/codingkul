import ProblemForm from "@/components/problems/ProblemForm";
import PageHeader from "@/components/shared/PageHeader";

export default function NewProblemPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="Add New Problem"
        description="Create a new DSA problem and assign it to a sheet"
        backHref="/dashboard/problems"
      />
      <ProblemForm />
    </div>
  );
}
