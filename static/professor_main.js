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
fetch('/api/professor/courses')
  .then(response => response.json())
  .then(data => {
    const subjectContainer = document.querySelector('.subjectContainer');
    subjectContainer.innerHTML = ''; // 기존 항목 제거

    if (data.length === 0) {
      subjectContainer.innerHTML = '<p style="text-align:center;">등록된 수업이 없습니다.</p>';
      return;
    }

    data.forEach(item => {
      const subjectItemContainer = document.createElement('div');
      subjectItemContainer.classList.add('subjectItemContainer');

      const subjectItem = document.createElement('div');  
      subjectItem.classList.add('subjectItem');

      const subjectElement = document.createElement('div');
      subjectElement.classList.add('subject');
      subjectElement.textContent = item.subject;

      const time12Container = document.createElement('div');
      time12Container.classList.add('time12Container');

      const time1Element = document.createElement('div');
      time1Element.classList.add('time1');
      time1Element.textContent = "시간 정보 없음";  // 나중에 연동 가능

      const time2Element = document.createElement('div');
      time2Element.classList.add('time2');
      time2Element.textContent = " ";  // 공백 or 다른 정보

      const calendarIcon = document.createElement('div');
      calendarIcon.classList.add('calendarIcon');
      calendarIcon.textContent = '📅';
      calendarIcon.onclick = () => {
        window.location.href = `/calendar?course_id=${item.id}`;
      };

      const timetableIcon = document.createElement('div');
      timetableIcon.classList.add('timetableIcon');
      timetableIcon.textContent = '📝';
      timetableIcon.onclick = () => {
        window.location.href = '/admin';
      };

      time12Container.appendChild(time1Element);
      time12Container.appendChild(time2Element);
      subjectItem.appendChild(subjectElement);
      subjectItem.appendChild(time12Container);
      subjectItem.appendChild(calendarIcon);
      subjectItem.appendChild(timetableIcon);
      subjectItemContainer.appendChild(subjectItem);
      subjectContainer.appendChild(subjectItemContainer);
    });
  })
  .catch(error => {
    console.error('과목 불러오기 실패:', error);
    alert('과목 정보를 불러오는 중 오류가 발생했습니다.');
  });

// 로그아웃 버튼
const goback_button = document.getElementById('goback_button');
goback_button.onclick = () => {
    window.location.href = '/logout';
};
