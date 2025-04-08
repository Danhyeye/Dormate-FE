import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

import { z } from "zod"
import { promises as fs } from "fs"
import path from "path"
import { taskSchema } from "./data/scheme"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(host)/rooms/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function Page() {
  const tasks = await getTasks()
  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Property Management</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-1 md:gap-6 md:py-2">

            <div className="md:hidden">
              <Image
                src="/examples/tasks-light.png"
                width={1280}
                height={998}
                alt="Playground"
                className="block dark:hidden"
              />
              <Image
                src="/examples/tasks-dark.png"
                width={1280}
                height={998}
                alt="Playground"
                className="hidden dark:block"
              />
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Property Management</h2>
                  <p className="text-muted-foreground">
                    Here&apos;s a list of properties!
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={"/property/new"}><Button>Add new property</Button></Link>
                </div>
              </div>
              <DataTable data={tasks} columns={columns} />
            </div>

          </div>
        </div>
      </div>
    </SidebarInset>

  )
}