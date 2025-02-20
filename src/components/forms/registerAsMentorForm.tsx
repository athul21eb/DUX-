"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, setYear, startOfYear } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { CreateMentorProfileAction } from "@/app/actions/mentor";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Skill } from "@/types/skills";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { RegisterMentorformSchema } from "@/utils/validator/registerMentor";
import toast from "react-hot-toast";
import { CreateMentorProfileAction } from "@/lib/actions/mentor/registerAsMentor";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof RegisterMentorformSchema>;

// Reusable Date Picker Component
interface DatePickerProps {
  name: string;
  label: string;
  form: any;
  isEndDate?: boolean;
}

export function DatePicker({ name, label, form, isEndDate }: DatePickerProps) {
  const isPresent = name.includes("endDate");

  const [year, setYearState] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date());

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                >
                  {field.value ? format(field.value, "PPP") : <span>{isPresent ? "Present" : "Pick a date"}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex justify-between items-center p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newYear = year - 1;
                    setYearState(newYear);
                    setMonth(startOfYear(setYear(new Date(), newYear))); // Corrected function calls
                  }}
                >
                  ← {year - 1}
                </Button>
                <span className="font-medium">{year}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newYear = year + 1;
                    setYearState(newYear);
                    setMonth(startOfYear(setYear(new Date(), newYear))); // Corrected function calls
                  }}
                >
                  {year + 1} →
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                month={month} // Controls the displayed month
                onMonthChange={setMonth} // Updates when user changes months
              />
            </PopoverContent>
          </Popover>
          {isEndDate && <p className="text-sm text-muted-foreground">Leave empty for current position</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}



export default function MentorProfileForm({
  availableSkills,
}: {
  availableSkills: Skill[];
}) {
  const { data: session } = useSession();
const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

  const [newLanguage, setNewLanguage] = useState("");

   // Update name, email, image from session whenever it changes
   useEffect(() => {
    if (session?.user) {
      form.setValue("name", session.user.name || "");
      form.setValue("email", session.user.email || "");
      setPreviewURL(session.user.image || "");

    }
  }, [session]);

  // Default form values using session data
  const defaultValues: Partial<FormValues> = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone:  "",
    skills: [],

    aboutMe: "",
    experiences: [
      {
        role: "",
        company: "",
        startDate: new Date(),
        endDate: null,
        description: "",
      },
    ],
    educations: [
      {
        degree: "",
        institution: "",
        startDate: new Date(),
        endDate: null,
        description: "",
      },
    ],
    languages: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterMentorformSchema),
    defaultValues,
  });


  const allowedImageTypes = ["jpg", "jpeg", "png", "gif"];
  const allowedDocumentTypes = ["pdf", "doc", "docx"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedImageTypes.includes(fileExtension)) {
        toast.error("Invalid image format! Allowed formats: jpg, jpeg, png, gif");
        return;
      }

      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleAddLanguage = () => {
    const value = newLanguage.trim();
    if (value) {
      const currentLanguages = form.getValues("languages");
      form.setValue("languages", [...currentLanguages, value]);
      setNewLanguage("");
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const invalidFiles = files.filter(
        (file) => !allowedDocumentTypes.includes(file.name.split(".").pop()?.toLowerCase() || "")
      );

      if (invalidFiles.length > 0) {
        toast.error("Invalid document format! Allowed formats: pdf, doc, docx");
        return;
      }

      setSelectedDocuments(files);
    }
  };


  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const formattedData = {
        ...data,
        userId: session?.user?.id || "",
        experiences: data.experiences.map((exp) => ({
          ...exp,
          startDate: new Date(exp.startDate), // Ensure it's a Date object
          endDate: exp.endDate  ? new Date(exp.endDate) : null,
        })),
        educations: data.educations.map((edu) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate  ? new Date(edu.endDate) : null,
        })),
      };

      const res = await CreateMentorProfileAction(formattedData, selectedImage, selectedDocuments);
 toast.success(res.message);
      router.push("/");
      console.log(
        "%c===== Form Submission Data =====",
        "color: #4CAF50; font-weight: bold; font-size: 14px;"
      );
      console.log("%cResponse:", "color: #2196F3; font-weight: bold;", res);
      console.log("%cFormatted Data:", "color: #FF9800; font-weight: bold;", formattedData);
      console.log("%cSelected Image:", "color: #9C27B0; font-weight: bold;", selectedImage);
      console.log("%cSelected Documents:", "color: #E91E63; font-weight: bold;", selectedDocuments);
      console.log("%c===============================", "color: #4CAF50; font-weight: bold; font-size: 14px;");


    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentor Profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your profile to become a mentor
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={previewURL || session?.user?.image || ""}
                    alt={session?.user?.name || "Profile"}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Upload a profile picture (optional)
                </p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Your email cannot be changed
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* About Me */}
              <FormField
                control={form.control}
                name="aboutMe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about yourself, your expertise, and mentoring style..."
                        className="min-h-32"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      This will be visible to mentees looking for a mentor
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills - Responsive with 3 columns on large screens */}
              <div>
                <FormLabel>Skills</FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Select technologies and skills you can mentor in
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                  {availableSkills.map((skill) => (
                    <FormField
                      key={skill.id}
                      control={form.control}
                      name="skills"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.some(
                                  (s) => s.id === skill.id
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      skill,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (s) => s.id !== skill.id
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="font-normal">
                                    {skill.name}
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{skill.description ?? "tooltip"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>

                {form.formState.errors.skills && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.skills.message}
                  </p>
                )}
              </div>

              {/* Languages - Responsive with 3 columns on large screens */}
              <div>
                <FormLabel>Languages</FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Add languages you can mentor in
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                  {form.watch("languages").map((language, index) => (
                    <div
                      key={index}
                      className="bg-secondary/50 flex items-center px-3 py-1 rounded-full"
                    >
                      <span className="truncate flex-grow">{language}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 ml-1 flex-shrink-0"
                        onClick={() => {
                          const currentLanguages = form.getValues("languages");
                          form.setValue(
                            "languages",
                            currentLanguages.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newLanguage"
                    placeholder="Add a language..."
                    className="max-w-sm"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLanguage}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {form.formState.errors.languages && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.languages.message}
                  </p>
                )}
              </div>

              {/* Experiences */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Experience</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentExperiences = form.getValues("experiences");
                      form.setValue("experiences", [
                        ...currentExperiences,
                        {
                          role: "",
                          company: "",
                          startDate: new Date(),
                          endDate: null,
                          description: "",
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </Button>
                </div>
                {form.watch("experiences").map((_, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`experiences.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experiences.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <DatePicker
                          form={form}
                          name={`experiences.${index}.startDate`}
                          label="Start Date"
                        />
                        <DatePicker
                          form={form}
                          name={`experiences.${index}.endDate`}
                          label="End Date"
                          isEndDate={true}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-24" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {index > 0 && (
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const currentExperiences =
                                form.getValues("experiences");
                              form.setValue(
                                "experiences",
                                currentExperiences.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {form.formState.errors.experiences && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.experiences.message}
                  </p>
                )}
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Education</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentEducations = form.getValues("educations");
                      form.setValue("educations", [
                        ...currentEducations,
                        {
                          degree: "",
                          institution: "",
                          startDate: new Date(),
                          endDate: null,
                          description: "",
                        },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>
                {form.watch("educations").map((_, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`educations.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`educations.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <DatePicker
                          form={form}
                          name={`educations.${index}.startDate`}
                          label="Start Date"
                        />
                        <DatePicker
                          form={form}
                          name={`educations.${index}.endDate`}
                          label="End Date"
                          isEndDate={true}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`educations.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-24" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {index > 0 && (
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const currentEducations =
                                form.getValues("educations");
                              form.setValue(
                                "educations",
                                currentEducations.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {form.formState.errors.educations && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.educations.message}
                  </p>
                )}
              </div>

              {/* Documents */}
              <div>
                <FormLabel>Supporting Documents (Optional)</FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload relevant certifications or portfolios
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentChange}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}