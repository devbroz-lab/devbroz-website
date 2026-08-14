import { supabase } from "@/lib/supabase";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function parseIndianNumber(value) {
  if (value == null || value === "") return null;
  const normalized = String(value).replace(/[,₹\s]/g, "");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function friendlyRpcError(message = "") {
  if (message.includes("already applied to this role")) {
    return "You have already applied to this role. If you need to update your details, email careers@devbroz.com.";
  }
  if (message.includes("already registered with a different email")) {
    return "This phone number is already registered with a different email for this role.";
  }
  if (message.includes("Phone number is too short")) {
    return "Please enter a valid phone number with country code.";
  }
  if (message.includes("not found or not active")) {
    return "That role is no longer open. Please browse our current openings and try again.";
  }
  return message || "Something went wrong. Please try again or email careers@devbroz.com.";
}

export async function submitCareersApplication(form, roleSlug) {
  if (!supabase) {
    throw new Error("Application service is not configured. Please try again later.");
  }

  if (!form.resumeFile) {
    throw new Error("Please upload your resume (PDF).");
  }

  if (form.resumeFile.type !== "application/pdf") {
    throw new Error("Resume must be a PDF file.");
  }

  if (form.resumeFile.size > MAX_RESUME_BYTES) {
    throw new Error("Resume must be 5 MB or smaller.");
  }

  // Random suffix guards against two submissions landing in the same millisecond
  // (upsert is false, so a collision would reject the second applicant's upload).
  const uniqueSuffix = Math.random().toString(36).slice(2, 10);
  const resumePath = `${roleSlug}_${Date.now()}_${uniqueSuffix}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(resumePath, form.resumeFile, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Could not upload resume. Please try again.");
  }

  const { data, error } = await supabase.rpc("submit_application", {
    p_full_name: form.fullName.trim(),
    p_email: form.email.trim().toLowerCase(),
    p_phone: form.phone.trim(),
    p_role_slug: roleSlug,
    p_total_exp_yrs: Number(form.totalExperienceYrs),
    p_skills: form.skills.trim(),
    p_relevant_experience: form.pitch.trim(),
    p_linkedin_url: form.linkedinUrl.trim(),
    p_city: form.city.trim(),
    p_current_employer: form.currentEmployer.trim(),
    p_current_ctc: parseIndianNumber(form.currentCtc),
    p_expected_ctc: parseIndianNumber(form.expectedCtc),
    p_notice_period: form.noticePeriod,
    p_english_rating: form.englishRating,
    p_resume_path: resumePath,
    p_source: form.source,
  });

  if (error) {
    await supabase.storage.from("resumes").remove([resumePath]).catch(() => {});
    throw new Error(friendlyRpcError(error.message));
  }

  return data;
}
