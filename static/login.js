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

// 회원가입 처리
document.querySelector('#registerForm form').addEventListener('submit', function(e) {
    e.preventDefault();

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

// 로그인 처리
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

// 팝업 표시/숨김 함수
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
}

function hideSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'none';
}

// 라디오 버튼 선택 시 과목 입력칸 보여주기
document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', function () {
        document.getElementById('courseInputGroup').style.display = 'block';
    });
});
