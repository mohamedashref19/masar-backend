import CreateProjectForm from "../features/projects/components/CreateProjectForm";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";

export default function PostJob() {
  const { mutate: createProjectMutate, isPending } = useCreateProject();

  const onSubmit = (data) => {
    // 1. تظهير الداتا (تحويل الـ skills من String لـ Array زي ما الموديل بتاعك طالب)
    const formattedData = {
      ...data,
      skillsRequired: data.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""), // عشان لو ساب مسافة في الآخر
    };

    // 2. إرسال الريكويست
    createProjectMutate(formattedData);
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <CreateProjectForm onSubmit={onSubmit} isLoading={isPending} />
    </div>
  );
}
