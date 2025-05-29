// 폼 전환
document.getElementById('switchToRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});
document.getElementById('switchToLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// 교수/학생 버튼 클릭 시 라디오 체크와 입력란 토글
const professorBtn = document.getElementById('professorBtn');
const studentBtn = document.getElementById('studentBtn');
const professorRadio = document.getElementById('professorRadio');
const studentRadio = document.getElementById('studentRadio');
const professorCodeGroup = document.getElementById('professorCodeGroup');

professorBtn.addEventListener('click', function() {
    professorRadio.checked = true;
    studentRadio.checked = false;
    professorBtn.classList.add('btn-primary');
    studentBtn.classList.remove('btn-primary');
    studentBtn.classList.add('btn-secondary');
    professorBtn.classList.remove('btn-secondary');
    professorCodeGroup.style.display = 'block';
    console.log('[디버그] 교수 버튼 클릭 후 professorRadio.checked:', professorRadio.checked);
});
studentBtn.addEventListener('click', function() {
    studentRadio.checked = true;
    professorRadio.checked = false;
    studentBtn.classList.add('btn-primary');
    professorBtn.classList.remove('btn-primary');
    professorBtn.classList.add('btn-secondary');
    studentBtn.classList.remove('btn-secondary');
    professorCodeGroup.style.display = 'none';
    document.getElementById('professorCode').value = "";
    console.log('[디버그] 학생 버튼 클릭 후 studentRadio.checked:', studentRadio.checked);
});

// 회원가입 처리
document.querySelector('#registerForm form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 디버그용 라디오 체크
    console.log('[디버그-가입버튼] professorRadio.checked:', professorRadio.checked);
    console.log('[디버그-가입버튼] studentRadio.checked:', studentRadio.checked);

    let professor_code_val = '';
    let isProfessor = false;
    if (professorRadio.checked) {
        isProfessor = true;
        professor_code_val = document.getElementById('professorCode').value.trim();
        if (professor_code_val === '') {
            alert('교수 인증 코드를 입력하세요.');
            document.getElementById('professorCode').focus();
            return;
        }
        if (professor_code_val !== 'rytn2025') {
            alert('교수 인증 코드가 올바르지 않습니다.');
            document.getElementById('professorCode').focus();
            return;
        }
    }

    const courseRawInput = document.getElementById('courseInput').value;
    const courseArray = courseRawInput
        .split(',')
        .map(course => course.trim())
        .filter(course => course.length > 0);

    const formData = new FormData();
    formData.append('name', document.getElementById('regId').value);
    formData.append('student_id', document.getElementById('regId').value);
    formData.append('password', document.getElementById('regPw').value);
    formData.append('userType', document.querySelector('input[name="userType"]:checked').value);
    formData.append('courses', JSON.stringify(courseArray));
    if (isProfessor) {
        formData.append('professor_code', professor_code_val);
    }

    // 콘솔로 실제로 뭐가 들어가는지 확인!
    for (const pair of formData.entries()) {
        console.log('FORMDATA ENTRY:', pair[0]+ ': ' + pair[1]);
    }

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            showSuccessPopup();
        } else {
            return response.text();
        }
    })
    .then(text => {
        if (text && typeof text === "string") {
            alert(text);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    });
});

// 로그인 처리 (이 부분은 그대로!)
document.querySelector('#loginForm form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('student_id', document.getElementById('loginId').value);
    formData.append('password', document.getElementById('loginPw').value);
    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text();
        }
    })
    .then(text => {
        if (text) {
            const errorMsg = document.createElement('div');
            errorMsg.textContent = '학번 또는 비밀번호가 틀렸습니다.';
            errorMsg.style.color = 'red';
            document.querySelector('#loginForm form').appendChild(errorMsg);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('로그인 중 오류가 발생했습니다.');
    });
});

// 팝업 표시/숨김 함수 (그대로!)
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
}
function hideSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'none';
}

// (이 부분은 없어도 됩니다. 필요 없으면 삭제해도 무방)
document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', function () {
        document.getElementById('courseInputGroup').style.display = 'block';
    });
});
