// document.addEventListener('DOMContentLoaded', () => {
//     const saveSchedule_button = document.getElementById('saveSchedule_button');
//     console.log(saveSchedule_button); // 확인용 콘솔 출력
//     const deleteSchedule_button = document.getElementById('deleteSchedule_button');
//     // 로컬스토리지에 수정할 데이터가 있으면 불러오기
// const savedDate = localStorage.getItem('edit_date');
// const savedEvent = localStorage.getItem('edit_event');
// const savedTime = localStorage.getItem('edit_time');
// const editId = localStorage.getItem('edit_id'); 

// if (savedDate && savedEvent && savedTime) {
//     // 날짜
//     const [month, day] = savedDate.split('/');
//     document.getElementById('date_month').value = month;
//     document.getElementById('date_date').value = day;

//     // 과목
//     document.getElementById('subject').value = savedEvent;

//     // 시간
//     const [startTime, endTime] = savedTime.split('~');
//     const [sh, sm] = startTime.split(':');
//     const [eh, em] = endTime.split(':');

//     document.getElementById('startTime_hour').value = sh;
//     document.getElementById('startTime_minute').value = sm;
//     document.getElementById('endTime_hour').value = eh;
//     document.getElementById('endTime_minute').value = em;

//     // 사용 후 삭제 (다음에 또 채워지지 않도록)
//     localStorage.removeItem('edit_date');
//     localStorage.removeItem('edit_event');
//     localStorage.removeItem('edit_time');
// }
//     // 저장 버튼 클릭
//     saveSchedule_button.addEventListener('click', (e) => {
//         e.preventDefault(); // 링크 이동 막기

//         const month = document.getElementById('date_month').value;
//         const date = document.getElementById('date_date').value;
//         const subject = document.getElementById('subject').value;
//         const sh = document.getElementById('startTime_hour').value;
//         const sm = document.getElementById('startTime_minute').value;
//         const eh = document.getElementById('endTime_hour').value;
//         const em = document.getElementById('endTime_minute').value;

//         // 필수값 확인
//         if (!month || !date || !subject || !sh || !sm || !eh || !em) {
//             alert('모든 입력값을 채워주세요!');
//             return;
//         }

//         const fullDate = `${month.padStart(2, '0')}/${date.padStart(2, '0')}`;
//         const fullTime = `${sh.padStart(2, '0')}:${sm.padStart(2, '0')}~${eh.padStart(2, '0')}:${em.padStart(2, '0')}`;

//         console.log("⏳ 일정 저장 요청 중...", fullDate, fullTime);

//         fetch('/api/schedules', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 date: fullDate,
//                 event: subject,
//                 time: fullTime
//             }),
//         })
//         .then(res => res.json())
//         .then(data => {
//             console.log("서버 응답:", data); // 👈 응답 확인
//             if (data.status === 'created') {
//                 alert('✅ 일정이 저장되었습니다!');
//                 window.location.href = '/';
//             } else {
//                 alert('❌ 일정 저장 실패');
//             }
//         })
//         .catch(err => {
//             console.error('에러 발생:', err);
//             alert('⚠️ 서버 요청 중 에러 발생');
//         });
//     });

//     // 삭제 버튼 클릭
//     deleteSchedule_button.addEventListener('click', (e) => {
//         e.preventDefault(); // 링크 이동 막기

//         fetch('/api/schedules', {
//             method: 'GET'
//         })
//         .then(res => res.json())
//         .then(schedules => {
//             if (schedules.length === 0) {
//                 alert('삭제할 일정이 없습니다.');
//                 return;
//             }

//             const latest = schedules[schedules.length - 1];

//             fetch(`/api/schedules/${latest.id}`, {
//                 method: 'DELETE'
//             })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.status === 'deleted') {
//                     alert('🗑️ 일정이 삭제되었습니다.');
//                     window.location.href = '/';
//                 } else {
//                     alert('❌ 일정 삭제 실패');
//                 }
//             });
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const saveSchedule_button = document.getElementById('saveSchedule_button');
    const deleteSchedule_button = document.getElementById('deleteSchedule_button');

    // ✏️ 수정용 데이터 불러오기
    const savedDate = localStorage.getItem('edit_date');
    const savedEvent = localStorage.getItem('edit_event');
    const savedTime = localStorage.getItem('edit_time');
    const editId = localStorage.getItem('edit_id');

    if (savedDate && savedEvent && savedTime && editId) {
        // 날짜
        const [month, day] = savedDate.split('/');
        document.getElementById('date_month').value = month;
        document.getElementById('date_date').value = day;

        // 과목
        document.getElementById('subject').value = savedEvent;

        // 시간
        const [startTime, endTime] = savedTime.split('~');
        const [sh, sm] = startTime.split(':');
        const [eh, em] = endTime.split(':');

        document.getElementById('startTime_hour').value = sh;
        document.getElementById('startTime_minute').value = sm;
        document.getElementById('endTime_hour').value = eh;
        document.getElementById('endTime_minute').value = em;
    }

    // ✅ 저장 버튼 클릭
    saveSchedule_button.addEventListener('click', (e) => {
        e.preventDefault();

        const month = document.getElementById('date_month').value;
        const date = document.getElementById('date_date').value;
        const subject = document.getElementById('subject').value;
        const sh = document.getElementById('startTime_hour').value;
        const sm = document.getElementById('startTime_minute').value;
        const eh = document.getElementById('endTime_hour').value;
        const em = document.getElementById('endTime_minute').value;

        if (!month || !date || !subject || !sh || !sm || !eh || !em) {
            alert('모든 입력값을 채워주세요!');
            return;
        }

        const fullDate = `${month.padStart(2, '0')}/${date.padStart(2, '0')}`;
        const fullTime = `${sh.padStart(2, '0')}:${sm.padStart(2, '0')}~${eh.padStart(2, '0')}:${em.padStart(2, '0')}`;

        // ✨ 수정 여부에 따라 PUT 또는 POST
        if (editId) {
            fetch(`/api/schedules/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: fullDate,
                    event: subject,
                    time: fullTime
                }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'updated') {
                    alert('✏️ 일정이 수정되었습니다!');
                    localStorage.clear(); // ✅ 수정 끝났으니 비우기
                    window.location.href = '/';
                } else {
                    alert('❌ 일정 수정 실패');
                }
            })
            .catch(err => {
                console.error('수정 중 에러:', err);
                alert('⚠️ 서버 오류');
            });
        } else {
            // 새로운 일정 추가
            fetch('/api/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: fullDate,
                    event: subject,
                    time: fullTime
                }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'created') {
                    alert('✅ 일정이 저장되었습니다!');
                    window.location.href = '/';
                } else {
                    alert('❌ 일정 저장 실패');
                }
            })
            .catch(err => {
                console.error('저장 중 에러:', err);
                alert('⚠️ 서버 요청 에러');
            });
        }
    });

    // 🗑️ 삭제 버튼 클릭
    deleteSchedule_button.addEventListener('click', (e) => {
        e.preventDefault();

        fetch('/api/schedules', {
            method: 'GET'
        })
        .then(res => res.json())
        .then(schedules => {
            if (schedules.length === 0) {
                alert('삭제할 일정이 없습니다.');
                return;
            }

            const latest = schedules[schedules.length - 1];

            fetch(`/api/schedules/${latest.id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'deleted') {
                    alert('🗑️ 일정이 삭제되었습니다.');
                    window.location.href = '/';
                } else {
                    alert('❌ 일정 삭제 실패');
                }
            });
        });
    });
});

document.getElementById('goback_button').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
});