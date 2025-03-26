// // 테스트용 더미 데이터 - mysql API와 연결 후 더이상 더미 데이터 사용하지 않도록 수정해야함
// const dummyData = [
//     { "date": "04/25", "event": "알고리즘", "time": "09:30 ~ 10:00" },
//     { "date": "04/26", "event": "자료구조", "time": "10:30 ~ 11:00" }
// ];

// // 일정 container 선택
// const scheduleContainer = document.querySelector('.scheduleContainer');

// // 더미 데이터를 사용하여 일정 항목 생성 - mysql API와 연결 후 더이상 더미 데이터 사용하지 않도록 수정해야함
// dummyData.forEach(item => {
//     const scheduleItemContainer = document.createElement('div');
//     scheduleItemContainer.classList.add('scheduleItemContainer');

//     const scheduleItem = document.createElement('div');
//     scheduleItem.classList.add('scheduleItem');

//     const dateElement = document.createElement('div');
//     dateElement.classList.add('date');
//     dateElement.textContent = item.date;

//     const eventTimeContainer = document.createElement('div');
//     eventTimeContainer.classList.add('eventTimeContainer');

//     const eventElement = document.createElement('div');
//     eventElement.classList.add('event');
//     eventElement.textContent = item.event;

//     const timeElement = document.createElement('div');
//     timeElement.classList.add('time');
//     timeElement.textContent = item.time;

//     // 수정 아이콘
//     const editIcon = document.createElement('div');
//     editIcon.classList.add('editIcon');
//     editIcon.textContent = '✏️';
//     editIcon.onclick = () => {
//         window.location.href = '../student_add/student_add.html'; // 사용자에 맞게 경로 수정하셔야합니다
//     };

//     // eventTimeContainer에 event와 time을 추가
//     eventTimeContainer.appendChild(eventElement);
//     eventTimeContainer.appendChild(timeElement);
//     scheduleItem.appendChild(dateElement);
//     scheduleItem.appendChild(eventTimeContainer);
//     scheduleItem.appendChild(editIcon); // 수정 아이콘
//     scheduleItemContainer.appendChild(scheduleItem);
//     scheduleContainer.appendChild(scheduleItemContainer);
// });

// // "일정 추가" 버튼 클릭 시 student_add.html로 이동
// const addSchedule_button = document.getElementById('addSchedule_button');

// addSchedule_button.onclick = () => {
//     window.location.href = '../student_add/student_add.html';
// };


// // 더미 데이터 사용 안하고 백앤드 연결 시 사용할 코드

// // // 일정 container 선택
// // const scheduleContainer = document.querySelector('.scheduleContainer');

// // // 백엔드에서 일정 데이터를 가져오는 함수
// // async function fetchScheduleData() {
// //     try {
// //         const response = await fetch('YOUR_API_ENDPOINT'); // 실제 API 엔드포인트로 변경하셔야합니다.
// //         const data = await response.json();

// //         // 가져온 데이터로 일정 항목 생성
// //         data.forEach(item => {
// //             const scheduleItemContainer = document.createElement('div');
// //             scheduleItemContainer.classList.add('scheduleItemContainer');

// //             const scheduleItem = document.createElement('div');
// //             scheduleItem.classList.add('scheduleItem');

// //             const dateElement = document.createElement('div');
// //             dateElement.classList.add('date');
// //             dateElement.textContent = item.date;

// //             const eventTimeContainer = document.createElement('div');
// //             eventTimeContainer.classList.add('eventTimeContainer');

// //             const eventElement = document.createElement('div');
// //             eventElement.classList.add('event');
// //             eventElement.textContent = item.event;

// //             const timeElement = document.createElement('div');
// //             timeElement.classList.add('time');
// //             timeElement.textContent = item.time;

// //             // 수정 아이콘
// //             const editIcon = document.createElement('div');
// //             editIcon.classList.add('editIcon');
// //             editIcon.textContent = '✏️';
// //             editIcon.onclick = () => {
// //                 window.location.href = '../student_add/student_add.html'; // 사용자에 맞게 경로 수정하셔야합니다
// //             };

// //             // eventTimeContainer에 event와 time을 추가
// //             eventTimeContainer.appendChild(eventElement);
// //             eventTimeContainer.appendChild(timeElement);
// //             scheduleItem.appendChild(dateElement);
// //             scheduleItem.appendChild(eventTimeContainer);
// //             scheduleItem.appendChild(editIcon); // 수정 아이콘
// //             scheduleItemContainer.appendChild(scheduleItem);
// //             scheduleContainer.appendChild(scheduleItemContainer);
// //         });
// //     } catch (error) {
// //         console.error('데이터를 가져오는데 오류 발생', error);
// //     }
// // }

// // // 페이지 로드 시 데이터 가져오기
// // window.onload = fetchScheduleData;

// // // "일정 추가" 버튼 클릭 시 student_add.html로 이동
// // const addSchedule_button = document.getElementById('addSchedule_button');

// // addSchedule_button.onclick = () => {
// //     window.location.href = '../student_add/student_add.html';
// // };


// 일정 container 선택
const scheduleContainer = document.querySelector('.scheduleContainer');

// 일정 데이터를 백엔드에서 가져오는 함수
async function fetchScheduleData() {
    try {
        const response = await fetch('/api/schedules');
        const data = await response.json();

        // 기존 일정들 제거
        scheduleContainer.innerHTML = '';

        // 가져온 데이터로 일정 항목 생성
        data.forEach(item => {
            const scheduleItemContainer = document.createElement('div');
            scheduleItemContainer.classList.add('scheduleItemContainer');

            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('scheduleItem');

            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = item.date;

            const eventTimeContainer = document.createElement('div');
            eventTimeContainer.classList.add('eventTimeContainer');

            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = item.event;

            const timeElement = document.createElement('div');
            timeElement.classList.add('time');
            timeElement.textContent = item.time;

            // 수정 아이콘
            const editIcon = document.createElement('div');
            editIcon.classList.add('editIcon');
            editIcon.textContent = '✏️';
            editIcon.onclick = () => {
                localStorage.setItem('edit_id', item.id);      
                localStorage.setItem('edit_date', item.date);
                localStorage.setItem('edit_event', item.event);
                localStorage.setItem('edit_time', item.time);
                window.location.href = '/student_add.html';
            };

            // DOM 조립
            eventTimeContainer.appendChild(eventElement);
            eventTimeContainer.appendChild(timeElement);
            scheduleItem.appendChild(dateElement);
            scheduleItem.appendChild(eventTimeContainer);
            scheduleItem.appendChild(editIcon);
            scheduleItemContainer.appendChild(scheduleItem);
            scheduleContainer.appendChild(scheduleItemContainer);
        });

    } catch (error) {
        console.error('일정 데이터를 가져오는 중 오류 발생:', error);
    }
}

// 페이지 로드되면 일정 목록 불러오기
window.onload = fetchScheduleData;

// "일정 추가" 버튼 클릭 시 이동
const addSchedule_button = document.getElementById('addSchedule_button');
addSchedule_button.onclick = () => {
    // 수정 정보 초기화
    localStorage.removeItem('edit_id');
    localStorage.removeItem('edit_date');
    localStorage.removeItem('edit_event');
    localStorage.removeItem('edit_time');

    // 페이지 이동
    window.location.href = '/student_add.html';
};

const goback_button = document.getElementById('goback_button');

goback_button.onclick = () => {
    window.location.href = '/logout'; // 또는 '/login' 등 적절한 경로
};