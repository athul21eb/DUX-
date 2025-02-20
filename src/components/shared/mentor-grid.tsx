"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List } from "lucide-react"



export default function MentorGrid({ mentors }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {mentors?.length > 0 ? `Showing ${mentors.length} results` : "No mentors found"}
        </p>
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
        </div>
      </div>

      {mentors?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor: any, i: number) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={mentor.image || "./dux.svg"}
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
      ) : (
        <div className="text-center text-muted-foreground py-10">
          <p className="text-lg font-medium">No mentors available</p>
          <p className="text-sm">Check back later or adjust your filters.</p>
        </div>
      )}
    </div>
  );
}

