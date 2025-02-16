"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List } from "lucide-react"

const mentors = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Marketing",
    image: null,
  },
  {
    id: 2,
    name: "Dr. Michael Lee",
    role: "Health & Wellness Coach",
    image: null,
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Sports Mentor",
    image: null,
  },
  // Add more mentors as needed
]

export default function MentorGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 74 results</p>
        <div className="flex items-center gap-2">
          <Select defaultValue="relevant">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Most relevant</SelectItem>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          {/* <div className="flex items-center gap-1 rounded-md border p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor, i) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={mentor.image || "/dux.svg"}
                alt={mentor.name}
                width={400}
                height={300}
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.role}</p>
              <Button className="mt-4 w-full" variant="secondary">
                View profile
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

