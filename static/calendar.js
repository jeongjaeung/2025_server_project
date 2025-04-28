document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // ✅ admin 여부와 course_id 가져오기
  const isAdmin = window.isAdmin;
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

    eventOverlap: true,
    slotEventOverlap: true,

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
      return {
        html: `<div style="text-align: center;">
                 ${month}. ${day}<br>
                 ${weekday}
               </div>`
      };
    },

    // ✅ 일정 가져오기
    events: function (fetchInfo, successCallback, failureCallback) {
      const url = courseId
        ? `/api/schedules/by-course?course_id=${courseId}`
        : (isAdmin ? '/api/schedules/all' : '/api/schedules');

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`API 오류 (${res.status})`);
          return res.json();
        })
        .then(data => {
          // console.log('받아온 data:', data);
          let events = [];

          // ✅ 날짜(date)별로 모으기
          const dateGrouped = {};
          data.forEach(item => {
            const dateKey = item.date.trim();
            if (!dateGrouped[dateKey]) {
              dateGrouped[dateKey] = [];
            }
            dateGrouped[dateKey].push(item);
          });

          // ✅ 날짜별로 처리
          Object.keys(dateGrouped).forEach(dateKey => {
            const items = dateGrouped[dateKey];

            // 시간순 정렬
            items.sort((a, b) => {
              const [aStart] = a.time.trim().split('~');
              const [bStart] = b.time.trim().split('~');
              return aStart.localeCompare(bStart);
            });

            let groups = [];
            let currentGroup = [];
            let currentStart = null;
            let currentEnd = null;

            items.forEach(item => {
              const [startTime, endTime] = item.time.trim().split('~');

              if (!currentGroup.length) {
                currentGroup.push(item);
                currentStart = startTime;
                currentEnd = endTime;
              } else {
                if (startTime <= currentEnd) {
                  currentGroup.push(item);
                  if (endTime > currentEnd) currentEnd = endTime;
                } else {
                  groups.push({ start: currentStart, end: currentEnd, items: currentGroup });
                  currentGroup = [item];
                  currentStart = startTime;
                  currentEnd = endTime;
                }
              }
            });

            if (currentGroup.length) {
              groups.push({ start: currentStart, end: currentEnd, items: currentGroup });
            }

            // ✅ 그룹별로 event 생성
            groups.forEach(group => {
              const [month, day] = dateKey.split('/');

              events.push({
                title: '',
                start: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${group.start}`,
                end: `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${group.end}`,
                backgroundColor: isAdmin ? '#f06292' : '#64b5f6',
                borderColor: isAdmin ? '#c62828' : '#1976d2',
                textColor: 'transparent',
                extendedProps: {
                  tooltip: group.items.map(item => {
                    return `${item.name} : ${item.event}`; // name을 user_id로 사용
                  }).join('\n')
                }
              });
            });
          });

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
