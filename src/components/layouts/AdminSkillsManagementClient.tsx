'use client'

import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Generic reusable components first
// ---------------------------------

// Reusable DataTable Component
interface DataTableProps<T> {
  headers: string[];
  rows: T[];
  renderRow: (row: T) => ReactNode[];
}

const MotionTableRow = motion(TableRow);

function ReusableDataTable<T>({ headers, rows, renderRow }: DataTableProps<T>) {
  return (
    <div className="rounded-md border overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="px-4 py-3 text-left font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <MotionTableRow
                key={rowIndex}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="transition-colors"
              >
                {renderRow(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-3 text-sm">
                    {cell}
                  </TableCell>
                ))}
              </MotionTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Reusable Pagination Component
interface PaginationComponentProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

function PaginationComponent({ currentPage, pageCount, onPageChange }: PaginationComponentProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem className="text-sm">
            Page {currentPage} of {pageCount}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
              className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// Reusable Confirmation Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default"
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={confirmVariant === "destructive" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Skill Management Implementation
// ------------------------------

// Define the Skill schema
const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Description is required"),
});

type Skill = z.infer<typeof skillSchema>;

// Form Dialog for adding/editing skills
interface FormDialogProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  currentItem: T | null;
  form: any; // This is the react-hook-form useForm instance
  renderFields: (form: any) => ReactNode;
}

function FormDialog<T>({
  isOpen,
  onClose,
  onSubmit,
  title,
  form,
  renderFields
}: FormDialogProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderFields(form)}
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Main SkillManagement Component
const SkillManagement = () => {
  const headers = ["Skill Name", "Description", "Actions"];
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "JavaScript", description: "Programming language for web development" },
    { id: "2", name: "React", description: "JavaScript library for building UIs" },
    { id: "3", name: "Node.js", description: "Runtime for executing JavaScript on the server" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);

  const itemsPerPage = 5;
  const pageCount = Math.ceil(skills.length / itemsPerPage);
  const paginatedSkills = skills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const form = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  // Event handlers
  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    form.reset(skill);
    setDialogOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setCurrentSkill(skill);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentSkill) {
      setSkills(skills.filter(s => s.id !== currentSkill.id));
      setDeleteDialogOpen(false);

      // Adjust page if we delete the last item on a page
      const newPageCount = Math.ceil((skills.length - 1) / itemsPerPage);
      if (currentPage > newPageCount && newPageCount > 0) {
        setCurrentPage(newPageCount);
      }
    }
  };

  const onSubmit = (data: Skill) => {
    if (currentSkill?.id) {
      // Edit existing skill
      setSkills(skills.map(s => s.id === currentSkill.id ? { ...data, id: currentSkill.id } : s));
    } else {
      // Add new skill
      setSkills([...skills, { ...data, id: String(Date.now()) }]);
    }
    form.reset();
    setDialogOpen(false);
    setCurrentSkill(null);
  };

  const openNewSkillDialog = () => {
    form.reset({ name: "", description: "" });
    setCurrentSkill(null);
    setDialogOpen(true);
  };

  // Custom row renderer for the table
  const renderSkillRow = (skill: Skill) => [
    skill.name,
    skill.description,
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(skill)}
      >
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={() => handleDelete(skill)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  ];

  // Form fields renderer
  const renderSkillFields = (form: any) => (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter skill name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Enter skill description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Management</h1>
        <Button onClick={openNewSkillDialog}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Skill
        </Button>
      </div>

      {/* Use our reusable data table component */}
      <ReusableDataTable
        headers={headers}
        rows={paginatedSkills}
        renderRow={renderSkillRow}
      />

      {/* Use our reusable pagination component */}
      <PaginationComponent
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
      />

      {/* Use our reusable form dialog for add/edit */}
      <FormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={onSubmit}
        title={currentSkill ? "Edit Skill" : "Add New Skill"}
        currentItem={currentSkill}
        form={form}
        renderFields={renderSkillFields}
      />

      {/* Use our reusable confirmation dialog for delete */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete the skill "${currentSkill?.name}". This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default SkillManagement;