"use client";

import { useMemo, useState } from "react";
import FilterBar from "./FilterBar";

import { WorkCard } from "@/home/our-work";
import { workProjects } from "@/lib/data/work-data";
import { Section } from "@/components/layout/section";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: workProjects.length,
      commercial: workProjects.filter((p) => p.category === "commercial")
        .length,
      industrial: workProjects.filter((p) => p.category === "industrial")
        .length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workProjects.filter((project) => {
      const matchesFilter = filter === "all" || project.category === filter;

      const matchesSearch =
        query === "" ||
        project.client.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <Section className="min-h-screen bg-[#F6F4F0]">
      {/* Filters */}
      <div className="flex  my-10 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          active={filter}
          onChange={setFilter}
          options={[
            {
              value: "all",
              label: "All",
              count: counts.all,
            },
            {
              value: "commercial",
              label: "Commercial",
              count: counts.commercial,
            },
            {
              value: "industrial",
              label: "Industrial",
              count: counts.industrial,
            },
          ]}
        />

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project or country..."
            className="w-full rounded-full border border-[#E4E1DA] bg-white py-2.5 pl-4 pr-10 text-sm text-[#191D22] placeholder:text-[#9BA0A6] outline-none focus:border-[#C1602E]/40"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9BA0A6]">
            &#8981;
          </span>
        </div>
      </div>

      {/* Projects */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4E1DA] py-20 text-center">
          <p className="text-[15px] text-[#6B7178]">
            No projects found. Try changing the search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <WorkCard
              key={project.slug}
              project={project}
              index={index + 1}
              titleClassName="text-xl"
            />
          ))}
        </div>
      )}
    </Section>
  );
}
