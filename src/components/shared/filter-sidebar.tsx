"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const filters = {
  "Experience Level": [
    { label: "10+ years", count: 4 },
    { label: "5-10 years", count: 8 },
    { label: "5 years", count: 124 },
  ],
  "Expertise/Field": [
    { label: "Software Development", count: 24 },
    { label: "Digital Marketing", count: 3 },
    { label: "Health & Wellness", count: 3 },
    { label: "Career Development", count: 5 },
  ],
  "Mentor Gender": [
    { label: "Men", count: 67 },
    { label: "Women", count: 3 },
    { label: "All", count: 5 },
  ],
  "Hourly Rate": [
    { label: "$700 - $1000", count: 4 },
    { label: "$100 - $1500", count: 6 },
    { label: "$1500 - $2000", count: 10 },
    { label: "$2000 or above", count: 4 },
  ],
}

export function FilterSidebar() {
  return (
    <aside className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {Object.entries(filters).map(([category, items]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm font-medium">{category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center space-x-2">
                    <Checkbox id={item.label} />
                    <label
                      htmlFor={item.label}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label} ({item.count})
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}

