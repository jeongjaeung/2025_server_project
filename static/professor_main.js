// const dummyData = [
//     { "subject": "알고리즘", "time1": "화 09:00 ~ 10:15", "time2": "목 09:00 ~ 10:15" },
//     { "subject": "자료구조", "time1": "월 13:30 ~ 14:45", "time2": "수 12:00 ~ 13:15" },
//     { "subject": "운영체제", "time1": "금 09:00 ~ 10:15", "time2": "금 10:30 ~ 11:45" }
// ];

// // 일정 container 선택
// const subjectContainer = document.querySelector('.subjectContainer');

// // 더미 데이터를 사용하여 일정 항목 생성 - mysql API와 연결 후 더이상 더미 데이터 사용하지 않도록 수정해야함
// dummyData.forEach(item => {
//     const subjectItemContainer = document.createElement('div');
//     subjectItemContainer.classList.add('subjectItemContainer');

//     const subjectItem = document.createElement('div');  
//     subjectItem.classList.add('subjectItem');

//     const subjectElement = document.createElement('div');
//     subjectElement.classList.add('subject');
//     subjectElement.textContent = item.subject;

//     const time12Container = document.createElement('div');
//     time12Container.classList.add('time12Container');

//     const time1Element = document.createElement('div');
//     time1Element.classList.add('time1');
//     time1Element.textContent = item.time1;

//     const time2Element = document.createElement('div');
//     time2Element.classList.add('time2');
//     time2Element.textContent = item.time2;

//     // 달력 아이콘 추가
//     const calendarIcon = document.createElement('div');
//     calendarIcon.classList.add('calendarIcon');
//     calendarIcon.textContent = '📅'; // 아이콘으로 사용할 문자
//     calendarIcon.onclick = () => {
//         window.location.href = '/calendar'; // "📅" 버튼 클릭 시 calendar.html로 이동 
//     };

//     // 시간표 아이콘 추가
//     const timetableIcon = document.createElement('div');
//     timetableIcon.classList.add('timetableIcon');
//     timetableIcon.textContent = '📝'; // 아이콘으로 사용할 문자
//     timetableIcon.onclick = () => {
//         window.location.href = '/admin'; // "📝" 버튼 클릭 시 admin.html로 이동 
//     };

//     // time12Container에 ime1과 time2을 추가
//     time12Container.appendChild(time1Element);
//     time12Container.appendChild(time2Element);
//     subjectItem.appendChild(subjectElement);
//     subjectItem.appendChild(time12Container);
//     subjectItem.appendChild(calendarIcon); // 달력 아이콘 추가
//     subjectItem.appendChild(timetableIcon); // 시간표 아이콘 추가
//     subjectItemContainer.appendChild(subjectItem);
//     subjectContainer.appendChild(subjectItemContainer);
// });


// const goback_button = document.getElementById('goback_button');

// goback_button.onclick = () => {
//     window.location.href = '/logout'; // 또는 '/login' 등 적절한 경로
// };

// 교수의 과목 목록을 API로 불러옴
// 기존 과목 목록 불러오기
fetch('/api/professor/courses')
  .then(response => response.json())
  .then(data => {
    const subjectContainer = document.querySelector('.subjectContainer');
    subjectContainer.innerHTML = ''; // 기존 항목 제거

    if (data.length === 0) {
      subjectContainer.innerHTML = '<p style="text-align:center;">등록된 수업이 없습니다.</p>';
      // 과목이 없어도 일정은 보여야 하므로 fetchAllSchedules 호출
      fetchAllSchedules();
      return;
    }

    // ★★★ 과목명+버튼 한 줄에 표시 (flex row)
    data.forEach(item => {
      const subjectItemContainer = document.createElement('div');
      subjectItemContainer.classList.add('subjectItemContainer');

      // flex row
      const subjectFlex = document.createElement('div');
      subjectFlex.style.display = "flex";
      subjectFlex.style.alignItems = "center";
      subjectFlex.style.justifyContent = "center";
      subjectFlex.style.gap = "18px";

      // 캘린더 아이콘
      const calendarIcon = document.createElement('div');
      calendarIcon.classList.add('calendarIcon');
      const calendarImg = document.createElement('img');
      calendarImg.src = '/static/images/calendar.png';
      calendarImg.alt = 'calendar';
      calendarImg.classList.add('calendarImage');
      calendarImg.style.width = '30px';
      calendarImg.style.height = '30px';
      calendarIcon.appendChild(calendarImg);
      calendarIcon.style.cursor = "pointer";
      calendarIcon.onclick = () => {
        window.location.href = `/calendar?course_id=${item.id}`;
      };

      // 과목명(가운데)
      const subjectElement = document.createElement('div');
      subjectElement.classList.add('subject');
      subjectElement.textContent = item.subject;
      subjectElement.style.fontWeight = "bold";
      subjectElement.style.fontSize = "1.1rem";
      subjectElement.style.textAlign = "center";
      subjectElement.style.minWidth = "80px";

      // 수정(에디트) 아이콘
      const editIcon = document.createElement('div');
      editIcon.classList.add('timetableIcon');
      const editImg = document.createElement('img');
      editImg.src = '/static/images/edit.png';
      editImg.alt = 'edit';
      editImg.classList.add('editImage');
      editImg.style.width = '30px';
      editImg.style.height = '30px';
      editIcon.appendChild(editImg);
      editIcon.style.cursor = "pointer";
      editIcon.onclick = () => {
        window.location.href = '/admin';
      };

      // flex row로 붙이기
      subjectFlex.appendChild(calendarIcon);
      subjectFlex.appendChild(subjectElement);
      subjectFlex.appendChild(editIcon);

      subjectItemContainer.appendChild(subjectFlex);
      subjectContainer.appendChild(subjectItemContainer);
    });

    // 과목 불러온 후 일정도 불러옴
    fetchAllSchedules();
  })
  .catch(error => {
    console.error('과목 불러오기 실패:', error);
    alert('과목 정보를 불러오는 중 오류가 발생했습니다.');
    // 과목 못 불러와도 일정은 시도
    fetchAllSchedules();
  });

// ▼ 일정(시험) 목록 불러오는 함수
function fetchAllSchedules() {
  // 일정 리스트를 보여줄 컨테이너
  const scheduleContainer = document.querySelector('.scheduleContainer');
  if (!scheduleContainer) return; // 컨테이너 없으면 종료

  fetch('/api/schedules/all')
    .then(response => response.json())
    .then(data => {
      scheduleContainer.innerHTML = ''; // 기존 일정 제거

      if (data.length === 0) {
        scheduleContainer.innerHTML = '<p style="text-align:center;">등록된 일정이 없습니다.</p>';
        return;
      }

      // 일정 데이터 반복 출력
      data.forEach(item => {
        const scheduleItemContainer = document.createElement('div');
        scheduleItemContainer.classList.add('scheduleItemContainer');

        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('scheduleItem');

        // 날짜/시간/과목/학생학번 표시
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
          <strong>날짜:</strong> ${item.date} <br>
          <strong>시간:</strong> ${item.time} <br>
          <strong>시험명(과목명):</strong> ${item.event} <br>
          <strong>학생학번:</strong> ${item.student_id}
        `;
        scheduleItem.appendChild(infoDiv);

        scheduleItemContainer.appendChild(scheduleItem);
        scheduleContainer.appendChild(scheduleItemContainer);
      });
    })
    .catch(error => {
      console.error('일정 데이터를 가져오는 중 오류 발생:', error);
      scheduleContainer.innerHTML = '<p style="color:red;">일정 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    });
}

// 로그아웃(혹은 뒤로가기) 버튼
const goback_button = document.getElementById('goback_button');
goback_button.onclick = () => {
    window.location.href = '/logout';
};
