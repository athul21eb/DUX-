'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Description is required"),
});

type Skill = z.infer<typeof skillSchema>;

type TableProps<T extends Record<string, any>> = {
  headers: string[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

const MotionTableRow = motion(TableRow);

const DataTable = <T extends Record<string, any>>({ headers, rows, onEdit, onDelete }: TableProps<T>) => {
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
                {Object.entries(row).map(([key, value], colIndex) => {
                  if (key !== 'id') {
                    return (
                      <TableCell key={colIndex} className="px-4 py-3 text-sm">
                        {String(value)}
                      </TableCell>
                    );
                  }
                  return null;
                })}
                <TableCell className="px-4 py-3 text-sm flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(row)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </MotionTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center">
                No skills found. Add a new skill to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Management</h1>
        <Button onClick={openNewSkillDialog}>
          Add New Skill
        </Button>
      </div>

      {/* Skills Table */}
      <DataTable
        headers={headers}
        rows={paginatedSkills}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem className="text-sm">
                Page {currentPage} of {pageCount}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add/Edit Skill Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill "{currentSkill?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SkillManagement;