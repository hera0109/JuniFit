// 한국 시간(KST) 포맷팅 유틸리티
export function formatKoreanDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/\. /g, '. ');
}

// 간단한 날짜 포맷 (YYYY. MM. DD.)
export function formatSimpleDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 시간만 포맷 (오전/오후 HH:MM)
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
