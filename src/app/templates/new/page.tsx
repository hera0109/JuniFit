"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash } from "lucide-react";

type Exercise = {
  id: string;
  name: string;
  target: { sets: number | string ; reps: { min: number | string ; max: number | string } };
  restSeconds: number | string;
  intention: string;
  note: string;
};

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: String(Date.now()), name: "", target: { sets: "", reps: { min: "", max: "" } }, restSeconds: "", intention: "", note: "" },
  ]);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    exercises?: Record<string, { summary?: string }>;
  }>({});

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), name: "", target: { sets: "", reps: { min: "", max: "" } }, restSeconds: "", intention: "", note: "" },
    ]);
  };

  const updateExercise = (id: string, updater: (ex: Exercise) => Exercise) => {
    setExercises((prev) => {
      const next = prev.map((ex) => (ex.id === id ? updater(ex) : ex));
      // compute per-exercise summaries immediately from the new array
      const exErrors: Record<string, { summary?: string }> = {};
      next.forEach((ex) => {
        const msg = getMissingSummary(ex, 0 as number);
        if (msg) exErrors[ex.id] = { summary: msg };
      });
      setErrors((prevErr) => ({ ...prevErr, exercises: Object.keys(exErrors).length ? exErrors : undefined }));
      return next;
    });
  };


  // Helper: returns summary message of missing required fields for an exercise, or undefined
  const getMissingSummary = (ex: Exercise, idx: number) => {
    const missing: string[] = [];
    if (!ex.name.trim()) missing.push("운동명");
    if (ex.target.sets === "" || Number(ex.target.sets) < 1) missing.push("세트 수");
    if (ex.target.reps.min === "" || ex.target.reps.max === "") missing.push("횟수(최소/최대)");
    if (ex.restSeconds === "" || Number(ex.restSeconds) < 0) missing.push("휴식 시간(초)");
    if (missing.length === 0) return undefined;
    return `${missing.join(", ")}을 입력해주세요`;
  };

  const clearError = (exerciseId?: string) => {
    if (!exerciseId) return;
    setErrors((e) => {
      if (!e.exercises) return e;
      const copy = { ...e.exercises };
      if (copy[exerciseId]) {
        delete copy[exerciseId];
      }
      return { ...e, exercises: Object.keys(copy).length ? copy : undefined };
    });
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    // remove any errors for this exercise
    setErrors((e) => {
      if (!e.exercises) return e;
      const copy = { ...e.exercises };
      delete copy[id];
      return { ...e, exercises: Object.keys(copy).length ? copy : undefined };
    });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const titleMissing = !title.trim();
    const descMissing = !description.trim();
    if (titleMissing) newErrors.title = "프로그램 제목을 입력하세요.";
    if (descMissing) newErrors.description = "전체 가이드를 입력하세요.";

    exercises.forEach((ex, i) => {
      const id = ex.id;
      const idx = i + 1;
      let hasMissing = false;
      if (!ex.name.trim()) hasMissing = true;
      if (ex.target.sets === "" || Number(ex.target.sets) < 1) hasMissing = true;
      if (ex.target.reps.min === "" || ex.target.reps.max === "") hasMissing = true;
      if (ex.restSeconds === "" || Number(ex.restSeconds) < 0) hasMissing = true;

      if (hasMissing) {
        newErrors.exercises = newErrors.exercises || {};
        const msg = getMissingSummary(ex, idx);
        newErrors.exercises[id] = { summary: msg || "운동 이름, 세트 수를 입력해주세요" };
      }
    });

    setErrors(newErrors);
    const hasErrors = Boolean(titleMissing || descMissing || (newErrors.exercises && Object.keys(newErrors.exercises).length > 0));
    return { ok: !hasErrors };
  };

  const save = () => {
    const v = validate();
    if (!v.ok) {
      // focus or scroll to first error could be added
      return;
    }

    const payload = { title, description, exercises };
    console.log("Saved template:", payload);
    // clear errors on successful save
    setErrors({});
    // show payload as popup since there's no DB yet
    alert("저장되었습니다\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="min-h-screen pb-32 px-4 pt-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="grid grid-cols-3 items-center mb-6">
          <div className="text-left">
            <Link href="/" className="text-slate-600">
              ← 뒤로가기
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-center">새 프로그램 만들기</h1>
          <div />
        </header>

        {/* Basic info */}
        <section className="bg-white rounded-xl shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">프로그램 제목</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}

          <label className="block text-sm font-medium text-slate-700 mb-2">전체 가이드</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="프로그램의 전체 가이드를 입력하세요"
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </section>

        {/* Exercises list */}
        <section className="space-y-4">
          {exercises.map((ex, i) => (
            <div key={ex.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex-1">
                  <input
                    value={ex.name}
                    onChange={(e) => {
                      const newEx = { ...ex, name: e.target.value };
                      updateExercise(ex.id, () => newEx);
                    }}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="운동명"
                  />
                </div>
                <button
                  onClick={() => removeExercise(ex.id)}
                  className="text-red-500 p-2 rounded-md hover:bg-red-50"
                  aria-label="삭제"
                  title="운동 삭제"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={ex.target.sets === "" ? "" : String(ex.target.sets)}
                    onChange={(e) => {
                      const newEx = { ...ex, target: { ...ex.target, sets: e.target.value === "" ? "" : Number(e.target.value) } };
                      updateExercise(ex.id, () => newEx);
                    }}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="세트 수"
                  />

                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={ex.target.reps.min === "" ? "" : String(ex.target.reps.min)}
                      onChange={(e) => {
                          const newEx = { ...ex, target: { ...ex.target, reps: { ...ex.target.reps, min: e.target.value === "" ? "" : Number(e.target.value) } } };
                          updateExercise(ex.id, () => newEx);
                        }}
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="횟수(최소)"
                    />
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={ex.target.reps.max === "" ? "" : String(ex.target.reps.max)}
                      onChange={(e) => {
                        const newEx = { ...ex, target: { ...ex.target, reps: { ...ex.target.reps, max: e.target.value === "" ? "" : Number(e.target.value) } } };
                        updateExercise(ex.id, () => newEx);
                      }}
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="횟수(최대)"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="number"
                    min={0}
                    max={3600}
                    value={ex.restSeconds === "" ? "" : String(ex.restSeconds)}
                    onChange={(e) => {
                      const newEx = { ...ex, restSeconds: e.target.value === "" ? "" : Number(e.target.value) };
                      updateExercise(ex.id, () => newEx);
                    }}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="휴식 시간(초)"
                  />
                  {/* Summary error shown below the exercise card */}

                  <input
                    value={ex.intention}
                    onChange={(e) => updateExercise(ex.id, (prev) => ({ ...prev, intention: e.target.value }))}
                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="의도"
                  />
                </div>
              </div>

              <textarea
                value={ex.note}
                onChange={(e) => updateExercise(ex.id, (prev) => ({ ...prev, note: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="비고"
              />
              {errors.exercises?.[ex.id]?.summary && (
                <p className="text-sm text-red-600 mt-3">{errors.exercises[ex.id].summary}</p>
              )}
            </div>
          ))}

          <button onClick={addExercise} className="w-full bg-blue-600 text-white rounded-lg py-3">
            + 운동 추가하기
          </button>
        </section>
      </div>

      {/* Save button - sticky bottom */}
      <div className="fixed left-0 right-0 bottom-4 flex justify-center">
        <button onClick={save} className="w-full max-w-md bg-green-600 text-white rounded-full py-3 mx-4 shadow-lg">
          저장하기
        </button>
      </div>
    </div>
  );
}
