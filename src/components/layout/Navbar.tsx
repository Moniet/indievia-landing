import React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  title: string
  subtitle: string
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-employIn-highlight/20">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-employIn-mediumText">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-employIn-mediumText" />
          </div>
          <input
            type="text"
            placeholder="Find member"
            className="pl-10 pr-4 py-2 bg-employIn-highlight/50 border border-employIn-highlight text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-employIn-blue focus:border-transparent w-64"
          />
        </div>

        <Button className="bg-employIn-blue hover:bg-employIn-darkBlue text-white">
          See credit notes
        </Button>
      </div>
    </div>
  )
}
