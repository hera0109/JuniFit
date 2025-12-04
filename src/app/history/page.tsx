"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Dumbbell, ChevronDown, ChevronRight } from "lucide-react";
import { getWorkoutLogs } from "@/lib/api";
import type { WorkoutSession, WorkoutSet } from "@/types/database";

type WorkoutLog = WorkoutSession & {
  sets: WorkoutSet[];
  programTitle?: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      const data = await getWorkoutLogs();
      setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 운동 시간 계산
  const getDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) return "진행 중";
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}분`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}시간 ${mins}분`;
  };

  // 세트를 운동별로 그룹화
  const groupSetsByExercise = (sets: WorkoutSet[]) => {
    const grouped: Record<string, WorkoutSet[]> = {};
    sets.forEach((set) => {
      if (!grouped[set.exercise_name]) {
        grouped[set.exercise_name] = [];
      }
      grouped[set.exercise_name].push(set);
    });
    return grouped;
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-8 bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center mb-6">
          <Link href="/" className="text-slate-600 mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">지난 운동 기록</h1>
        </header>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">로딩 중...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">아직 운동 기록이 없습니다.</p>
            <Link
              href="/workout"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              운동 시작하기
            </Link>
          </div>
        ) : (
          <section className="flex flex-col gap-4">
            {logs.map((log) => {
              const isExpanded = expandedSession === log.id;
              const groupedSets = groupSetsByExercise(log.sets);
              const exerciseCount = Object.keys(groupedSets).length;
              const totalSets = log.sets.length;

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* 세션 헤더 */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSession(log.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-slate-800">
                            {formatDate(log.started_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span>{formatTime(log.started_at)}</span>
                          <span>•</span>
                          <span>{getDuration(log.started_at, log.ended_at)}</span>
                        </div>
                        {log.programTitle && (
                          <p className="text-sm text-blue-600 mt-1">
                            {log.programTitle}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            운동 {exerciseCount}종목
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            총 {totalSets}세트
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 세션 상세 */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="space-y-4 mt-4">
                        {Object.entries(groupedSets).map(([exerciseName, sets]) => (
                          <div key={exerciseName} className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-slate-700 mb-2">
                              {exerciseName}
                            </h4>
                            <div className="space-y-1">
                              {sets
                                .sort((a, b) => a.set_number - b.set_number)
                                .map((set) => (
                                  <div
                                    key={set.id}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-slate-600">
                                      {set.set_number}세트
                                    </span>
                                    <span className="text-slate-800 font-medium">
                                      {set.weight}kg × {set.reps}회
                                      {set.rpe && (
                                        <span className="text-slate-500 ml-1">
                                          (RPE {set.rpe})
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {log.note && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">{log.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
