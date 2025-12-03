-- Insert Mock Programs
INSERT INTO programs (title, description) VALUES
  ('상체 근력 운동', '가슴, 어깨, 팔 중심의 근력 강화 프로그램'),
  ('하체 집중 훈련', '스쿼트, 데드리프트 등 하체 근육 발달을 위한 프로그램'),
  ('전신 순환 운동', '짧은 시간에 전신을 골고루 단련하는 서킷 트레이닝');

-- Get program IDs for reference
DO $$
DECLARE
  program1_id uuid;
  program2_id uuid;
  program3_id uuid;
BEGIN
  -- Get program IDs
  SELECT id INTO program1_id FROM programs WHERE title = '상체 근력 운동';
  SELECT id INTO program2_id FROM programs WHERE title = '하체 집중 훈련';
  SELECT id INTO program3_id FROM programs WHERE title = '전신 순환 운동';

  -- Insert Exercises for Program 1 (상체 근력 운동)
  INSERT INTO program_exercises (program_id, name, target_sets, target_reps, rest_seconds, intention, "order") VALUES
    (program1_id, '벤치프레스', 3, 10, 90, '가슴 근력 향상', 1),
    (program1_id, '숄더프레스', 3, 12, 60, '어깨 근력 강화', 2),
    (program1_id, '바벨로우', 4, 10, 90, '등 근육 발달', 3);

  -- Insert Exercises for Program 2 (하체 집중 훈련)
  INSERT INTO program_exercises (program_id, name, target_sets, target_reps, rest_seconds, intention, "order") VALUES
    (program2_id, '스쿼트', 4, 10, 120, '하체 전체 근력', 1),
    (program2_id, '데드리프트', 3, 8, 180, '후면 사슬 강화', 2),
    (program2_id, '런지', 3, 12, 90, '하체 안정성', 3),
    (program2_id, '레그컬', 3, 15, 60, '햄스트링 강화', 4);

  -- Insert Exercises for Program 3 (전신 순환 운동)
  INSERT INTO program_exercises (program_id, name, target_sets, target_reps, rest_seconds, intention, "order") VALUES
    (program3_id, '버피', 3, 12, 60, '전신 컨디셔닝', 1),
    (program3_id, '플랭크', 3, 45, 45, '코어 강화', 2),
    (program3_id, '마운틴 클라이머', 3, 25, 45, '심폐 지구력', 3),
    (program3_id, '점프 스쿼트', 3, 18, 60, '폭발적 파워', 4),
    (program3_id, '푸시업', 3, 12, 45, '상체 근력', 5),
    (program3_id, '하이 니즈', 3, 25, 45, '심폐 지구력', 6);
END $$;
