import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ReactNode } from "react";

import { Form } from "react-hook-form";
import { Button } from "../ui/button";
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

export default function FormDialog<T>({
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