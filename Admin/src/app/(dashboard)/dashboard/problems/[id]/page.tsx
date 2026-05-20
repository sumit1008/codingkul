import ProblemForm from "@/components/problems/ProblemForm";
import PageHeader from "@/components/shared/PageHeader";

export default async function EditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="Edit Problem"
        description="Update problem details"
        backHref="/dashboard/problems"
      />
      <ProblemForm problemId={id} />
    </div>
  );
}
