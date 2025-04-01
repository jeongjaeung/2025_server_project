// 회원가입/로그인 폼 전환
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
        .filter(course => course.length > 0);  // 빈 항목 제거

    const formData = new FormData();
    formData.append('name', document.getElementById('regId').value);
    formData.append('student_id', document.getElementById('regId').value);
    formData.append('password', document.getElementById('regPw').value);
    formData.append('userType', document.querySelector('input[name="userType"]:checked').value);
    formData.append('courses', JSON.stringify(courseArray)); // 👈 배열을 문자열로 인코딩해서 보냄

    fetch('/register', {
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
        if (text) alert(text);
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

// 라디오 버튼 클릭 시 과목 선택 칸 보여주기
document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const courseInputGroup = document.getElementById('courseInputGroup');
      courseInputGroup.style.display = 'block';
    });
  });