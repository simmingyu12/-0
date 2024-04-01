// 시계 기능
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

// 날씨 표시
function updateWeather() {
    const apiKey = 'e00693dc6f9c360b3b1cb0d1686404a8'; // OpenWeatherMap API 키
    const city = 'Busan'; // 날씨 정보를 가져올 도시 이름을 넣어주세요

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('날씨 정보를 가져오는 데 문제가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => {
            const temperature = data.main.temp;
            const condition = data.weather[0].description;
            document.getElementById('weather').textContent = `날씨: ${temperature}도, ${condition}`;
        })
        .catch(error => {
            console.error('날씨 정보를 가져오는 중 오류가 발생했습니다:', error);
        });
}

updateWeather(); // 페이지 로드 시 기본적으로 날씨 정보 표시
setInterval(updateWeather, 600000); // 10분마다 날씨 정보 업데이트

// 로그인/로그아웃 기능
const loginContainer = document.getElementById('loginContainer');
const userStatus = document.getElementById('userStatus');

function updateLoginStatus() {
    const savedName = localStorage.getItem('username');
    if (savedName) {
        loginContainer.innerHTML = `<p>안녕하세요, ${savedName}님!</p><button id="logoutBtn">로그아웃</button>`;
        userStatus.innerHTML = `<p>로그인 중: ${savedName}님</p>`;
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        loginContainer.innerHTML = `<form id="loginForm"><label for="name">이름:</label><input type="text" id="name" required><button type="submit">로그인</button></form>`;
        userStatus.innerHTML = `<p>로그인이 필요합니다.</p>`;
    }
}

updateLoginStatus();

function login(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    localStorage.setItem('username', name);
    updateLoginStatus();
    alert(`환영합니다, ${name}님!`);
}

function logout() {
    localStorage.removeItem('username');
    updateLoginStatus();
    alert('로그아웃되었습니다.');
}

document.getElementById('loginForm').addEventListener('submit', login);

// 메모 기능
const memoInput = document.getElementById('memoInput');
const memoList = document.getElementById('memoList');

document.getElementById('addMemoBtn').addEventListener('click', addMemo);

function addMemo() {
    const memoText = memoInput.value.trim();
    if (memoText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${memoText} <button class="deleteMemoBtn">X</button>`;
        memoList.appendChild(li);
        memoInput.value = '';
        saveMemo(memoText);
    } else {
        alert('메모를 입력하세요.');
    }
}

function saveMemo(memo) {
    let memos = localStorage.getItem('memos') ? JSON.parse(localStorage.getItem('memos')) : [];
    memos.push(memo);
    localStorage.setItem('memos', JSON.stringify(memos));
}

function loadMemos() {
    let memos = localStorage.getItem('memos') ? JSON.parse(localStorage.getItem('memos')) : [];
    memos.forEach(memo => {
        const li = document.createElement('li');
        li.innerHTML = `${memo} <button class="deleteMemoBtn">X</button>`;
        memoList.appendChild(li);
    });
}

loadMemos();

// 삭제 버튼 추가
memoList.addEventListener('click', function(event) {
    if (event.target.classList.contains('deleteMemoBtn')) {
        event.target.parentElement.remove();
        const memos = Array.from(memoList.children).map(li => li.textContent.split(' ')[0]);
        localStorage.setItem('memos', JSON.stringify(memos));
    }
});

// 랜덤 이미지 보기
function showRandomImage() {
    fetch('https://source.unsplash.com/random')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.url;
    })
    .then(imageUrl => {
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Random Image">`;
    })
    .catch(error => {
        console.error('There was a problem fetching the image:', error);
    });
}

showRandomImage(); // 페이지 로드 시 기본적으로 랜덤 이미지 보기
document.getElementById('randomImageBtn').addEventListener('click', showRandomImage);
