"use client"

import { useEffect, useState } from "react"
import { CldImage } from "next-cloudinary"
import { approveMentor, getMentorApprovalById, rejectMentor } from "@/lib/actions/admin/approvals/approvalsAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MentorApproval({ mentorId, mentor }: { mentorId: string; mentor: any }) {
  const [formattedMentor, setFormattedMentor] = useState<any>(null)
  const [loading ,setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mentor) {
      setFormattedMentor({
        ...mentor,
        createdAt: new Date(mentor.createdAt).toLocaleDateString(),
        educations: mentor.educations?.map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate).toLocaleDateString(),
          endDate: edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present",
        })),
        experiences: mentor.experiences?.map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate).toLocaleDateString(),
          endDate: exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present",
        })),
      })
    }
  }, [mentor])

  if (!formattedMentor) return <div>Loading...</div>

  const handleVerifyMentor = async () => {

 try {
  setLoading(true);
    const res = await approveMentor(mentorId);

    if(res.success){
      toast.success(res.message);
      router.push("/admin/approvals");

    }else{
      toast.error(res.message)
    }
 } catch (error) {
  console.log("error while verifying mentor",error);
  toast.error("error while verifying mentor")

 }finally{
  setLoading(false);
 }
    // Implement verification logic here
    console.log("Verifying mentor:", mentorId)
  }

  const handleRejectMentor = async () => {

    try {
      setLoading(true);
      const res = await rejectMentor(mentorId);

      if(res.success){
        toast.success(res.message);
        router.push("/admin/approvals");

      }else{
        toast.error(res.message)
      }
   } catch (error) {
    console.log("error while verifying mentor",error);
    toast.error("error while verifying mentor")

   }finally{
    setLoading(false);
   }
    // Implement rejection logic here
    console.log("Rejecting mentor:", mentorId)
  }

  return (
    <div className="max-w-4xl mx-auto p-6  shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row items-center mb-6">
        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
          <CldImage
            width="192"
            height="192"
            src={formattedMentor.image}
            alt={`${formattedMentor.mentorName}'s profile picture`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{formattedMentor.mentorName}</h1>
          <p className="text-gray-600 mb-2">{formattedMentor.email}</p>
          <p className="text-sm text-gray-500">Application submitted on: {formattedMentor.createdAt}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">About Me</h2>
          <p className="text-gray-700">{formattedMentor.aboutMe}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Application Details</h2>
          <p className="text-gray-700">{formattedMentor.applicationDetails}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <p className="text-gray-700">{formattedMentor.skills?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Languages</h2>
          <p className="text-gray-700">{formattedMentor.languages?.join(", ") || "N/A"}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Documents</h2>
        <ul className="list-disc pl-5">
          {formattedMentor.documents?.map((doc: string, index: number) => {
            const fileName = doc.split("/").pop() || `Document_${index + 1}.pdf`
            return (
              <li key={index} className="mb-2">
                <a href={doc} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {fileName}
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {formattedMentor.educations?.map((edu: any) => (
          <div key={edu.id} className="mb-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">
              {edu.degree} - {edu.institution}
            </p>
            <p className="text-sm text-gray-600">
              {edu.startDate} - {edu.endDate}
            </p>
            <p className="mt-2">{edu.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {formattedMentor.experiences?.map((exp: any) => (
          <div key={exp.id} className="mb-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">
              {exp.role} at {exp.company}
            </p>
            <p className="text-sm text-gray-600">
              {exp.startDate} - {exp.endDate}
            </p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleRejectMentor}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Reject
        </button>
        <button
          onClick={handleVerifyMentor}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Verify
        </button>
      </div>
    </div>
  )
}

