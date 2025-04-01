document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // ✅ admin 여부와 course_id 가져오기
  const isAdmin = window.isAdmin; // calendar.html에서 삽입된 값
  const courseId = new URLSearchParams(window.location.search).get('course_id');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'ko',
    height: 'parent',
    contentHeight: 'auto',
    expandRows: true,

    hiddenDays: [0],
    allDaySlot: false,
    slotMinTime: "08:00:00",
    slotMaxTime: "22:00:00",
    slotDuration: "00:30:00",
    scrollTime: "08:00:00",
    displayEventTime: false,

    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },

    dayHeaderContent: function(arg) {
      const date = arg.date;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      return `${month}.${day} ${weekday}`;
    },

    // ✅ 일정 가져오기
    events: function (fetchInfo, successCallback, failureCallback) {
      // URL 결정
      const url = courseId
        ? `/api/schedules/by-course?course_id=${courseId}`
        : (isAdmin ? '/api/schedules/all' : '/api/schedules');

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`API 오류 (${res.status})`);
          return res.json();
        })
        .then(data => {
          let events = [];

          if (isAdmin && !courseId) {
            // 🔧 관리자 + 전체 보기
            const grouped = {};
            data.forEach(item => {
              const dateKey = item.date.trim();
              const timeKey = item.time.trim();
              const key = `${dateKey}-${timeKey}`;

              if (!grouped[key]) {
                grouped[key] = {
                  date: dateKey,
                  time: timeKey,
                  hoverTexts: []
                };
              }

              grouped[key].hoverTexts.push(`${item.event} (${item.name})`);
            });

            events = Object.values(grouped).map(item => {
              const [month, day] = item.date.split('/');
              const [startTime, endTime] = item.time.split('~');

              return {
                title: '',
                start: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${startTime}`,
                end: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${endTime}`,
                backgroundColor: '#f06292',
                borderColor: '#c62828',
                textColor: 'transparent',
                extendedProps: {
                  tooltip: item.hoverTexts.join('\n')
                }
              };
            });

          } else {
            // 🔹 일반 학생 or 특정 수업을 보는 관리자
            events = data.map(item => {
              const [month, day] = item.date.split('/');
              const [startTime, endTime] = item.time.split('~');

              return {
                title: '',
                start: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${startTime}`,
                end: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${endTime}`,
                backgroundColor: isAdmin ? '#f06292' : '#64b5f6',
                borderColor: isAdmin ? '#c62828' : '#1976d2',
                textColor: 'transparent',
                extendedProps: {
                  tooltip: isAdmin ? `${item.event} (${item.name})` : item.event
                }
              };
            });
          }

          successCallback(events);
        })
        .catch(err => {
          console.error('일정 불러오기 실패', err);
          failureCallback(err);
        });
    },

    // ✅ 툴팁 표시용
    eventDidMount: function(info) {
      const tooltip = info.event.extendedProps.tooltip || '';
      info.el.setAttribute('title', tooltip);
    }
  });

  calendar.render();
});

// ✅ 돌아가기 버튼
document.getElementById('goback_button').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '/';
});
