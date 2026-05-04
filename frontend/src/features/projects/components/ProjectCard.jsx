import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-primary p-6 rounded-xl border border-slate-800 shadow-lg hover:border-secondary transition-colors duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-heading line-clamp-2">
            {project.title}
          </h3>
          <span className="bg-slate-800 text-secondary px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 border border-secondary/20">
            {project.budget} $
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* عرض المهارات المطلوبة (بحد أقصى 3 عشان الشكل العام) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-900 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700"
            >
              {skill}
            </span>
          ))}
          {project.skillsRequired?.length > 3 && (
            <span className="bg-slate-900 text-slate-500 text-xs px-2 py-1 rounded border border-slate-700">
              +{project.skillsRequired.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-500">
          القسم: <span className="text-slate-300">{project.category}</span>
        </span>

        {/* الزرار ده هيودي المستقل لصفحة تفاصيل المشروع عشان يقدم العرض بتاعه */}
        <Link
          to={`/projects/${project._id}`}
          className="text-sm text-secondary hover:text-white transition-colors"
        >
          عرض التفاصيل &larr;
        </Link>
      </div>
    </div>
  );
}
