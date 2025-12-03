// 백업용 Mock 데이터 (현재는 Supabase 사용)
export const mockPrograms = [
  {
    id: "p1",
    title: "상체 근력 운동",
    description: "가슴, 어깨, 팔 중심의 근력 강화 프로그램",
    exerciseCount: 3,
    exercises: [
      {
        id: "ex1",
        program_id: "p1",
        name: "벤치프레스",
        target_sets: 3,
        target_reps: 10,
        rest_seconds: 90,
        intention: "가슴 근력 향상",
        order: 1,
      },
      {
        id: "ex2",
        program_id: "p1",
        name: "숄더프레스",
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 60,
        intention: "어깨 근력 강화",
        order: 2,
      },
      {
        id: "ex3",
        program_id: "p1",
        name: "바벨로우",
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 90,
        intention: "등 근육 발달",
        order: 3,
      },
    ],
  },
  {
    id: "p2",
    title: "하체 집중 훈련",
    description: "스쿼트, 데드리프트 등 하체 근육 발달을 위한 프로그램",
    exerciseCount: 4,
    exercises: [
      {
        id: "ex1",
        program_id: "p2",
        name: "스쿼트",
        target_sets: 4,
        target_reps: 10,
        rest_seconds: 120,
        intention: "하체 전체 근력",
        order: 1,
      },
      {
        id: "ex2",
        program_id: "p2",
        name: "데드리프트",
        target_sets: 3,
        target_reps: 8,
        rest_seconds: 180,
        intention: "후면 사슬 강화",
        order: 2,
      },
      {
        id: "ex3",
        program_id: "p2",
        name: "런지",
        target_sets: 3,
        target_reps: 12,
        rest_seconds: 90,
        intention: "하체 안정성",
        order: 3,
      },
      {
        id: "ex4",
        program_id: "p2",
        name: "레그컬",
        target_sets: 3,
        target_reps: 15,
        rest_seconds: 60,
        intention: "햄스트링 강화",
        order: 4,
      },
    ],
  },
];

export const findProgramById = (id: string) => {
  return mockPrograms.find(program => program.id === id);
};