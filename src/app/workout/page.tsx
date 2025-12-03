"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockTemplates } from "@/data/mockData";

export default function WorkoutPage() {
  return (
    <div className="min-h-screen px-4 pt-6 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center mb-6">
          <Link href="/" className="text-slate-600 mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">운동 프로그램 선택</h1>
        </header>

        {/* 프로그램 목록 */}
        <section className="flex flex-col gap-8">
          {mockTemplates.map((template) => (
            <Link key={template.id} href={`/workout/${template.id}`}>
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  {template.title}
                </h3>
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center">
                  <span className="text-blue-600 text-base font-medium">
                    운동 {template.exerciseCount}개
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}