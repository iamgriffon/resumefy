import type { ResumeData } from '@/lib/file-parser';

interface ResumePreviewerProps {
  data: ResumeData;
}

export function ResumePreviewer({ data }: ResumePreviewerProps) {
  return (
    <div className="font-sans max-w-[100%] text-sm">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1">{data.personal.name}</h1>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
          <span>•</span>
          <span>{data.personal.location}</span>
          {data.personal.linkedIn && (
            <>
              <span>•</span>
              <span>{data.personal.linkedIn}</span>
            </>
          )}
          {data.personal.website && (
            <>
              <span>•</span>
              <span>{data.personal.website}</span>
            </>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b pb-1 mb-2">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between font-semibold">
              <div>{exp.position} • {exp.company}</div>
              <div>{exp.startDate} – {exp.endDate}</div>
            </div>
            <p className="my-1">{exp.description}</p>
            {exp.highlights && (
              <ul className="list-disc pl-5">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold border-b pb-1 mb-2">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <div className="font-semibold">{edu.institution}</div>
              <div>{edu.startDate} – {edu.endDate}</div>
            </div>
            <div>{edu.degree}, {edu.field}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills</h2>
        {typeof data.skills === 'string' ? (
          <div>{data.skills}</div>
        ) : data.skills && typeof data.skills === 'object' && 'skills' in data.skills ? (
          <div>{data.skills.skills}</div>
        ) : Array.isArray(data.skills) ? (
          (data.skills as Array<{ category: string; items: string[] | string }>).map((skillGroup, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">{skillGroup.category}:</span>{' '}
              <span>{Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}</span>
            </div>
          ))
        ) : (
          <div>No skills listed</div>
        )}
      </div>

      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold">{project.name}</div>
              <div>{project.description}</div>
              <div className="text-sm">
                <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
              </div>
              {project.link && (
                <div className="text-sm">
                  <span className="font-medium">Link:</span> {project.link}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-1">
              <span className="font-semibold">{cert.name}</span> - {cert.issuer}
              {cert.date && `, ${cert.date}`}
              {cert.expires && ` (Expires: ${cert.expires})`}
            </div>
          ))}
        </div>
      )}

      {data.additionalInfo && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b pb-1 mb-2">Additional Information</h2>
          <p>{data.additionalInfo}</p>
        </div>
      )}
    </div>
  );
} 