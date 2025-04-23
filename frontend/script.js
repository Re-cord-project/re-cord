// DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 차트 데이터 예시 (월간 글 작성 추이)
  const chartData = {
    months: ["1월", "2월", "3월", "4월", "5월", "6월"],
    posts: [3, 5, 4, 8, 6, 10],
  };

  // 차트 렌더링 함수 (실제로는 Chart.js 등의 라이브러리 활용)
  function renderChart() {
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) return;

    // 실제 프로젝트에서는 Chart.js 등을 사용하여 차트 구현
    // 여기서는 간단한 텍스트로 대체
    chartContainer.innerHTML = `
            <div class="sample-chart">
                <p>월간 글 작성 수:</p>
                <ul class="chart-data">
                    ${chartData.months
                      .map(
                        (month, index) =>
                          `<li>${month}: ${chartData.posts[index]}개</li>`
                      )
                      .join("")}
                </ul>
            </div>
        `;
  }

  // 알림 클릭 이벤트
  function setupNotificationEvents() {
    const notification = document.querySelector(".notification-icon");
    if (notification) {
      notification.addEventListener("click", function () {
        alert("알림 기능은 아직 개발 중입니다.");
      });
    }
  }

  // 게시물 항목 클릭 이벤트
  function setupPostItemEvents() {
    const postItems = document.querySelectorAll(".post-item");
    postItems.forEach((item) => {
      item.addEventListener("click", function () {
        // 게시물 제목 가져오기
        const title = this.querySelector("h3").textContent;
        // 실제로는 해당 게시물 페이지로 이동
        console.log(`게시물 '${title}'로 이동합니다.`);
        // 예시 알림
        alert(`게시물 '${title}'로 이동합니다.`);
      });
    });
  }

  // 사이드바 메뉴 클릭 이벤트
  function setupSidebarEvents() {
    const navItems = document.querySelectorAll(".user-nav li a");
    navItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        if (!this.parentNode.classList.contains("active")) {
          e.preventDefault();
          const menuName = this.querySelector("span").textContent;
          console.log(`${menuName} 메뉴로 이동합니다.`);
          // 실제로는 해당 페이지로 이동
          alert(`${menuName} 페이지로 이동합니다.`);
        }
      });
    });
  }

  // 프로필 편집 아이콘 클릭 이벤트
  function setupProfileEditEvent() {
    const editIcon = document.querySelector(".edit-icon");
    if (editIcon) {
      editIcon.addEventListener("click", function () {
        alert("프로필 편집 기능은 아직 개발 중입니다.");
      });
    }
  }

  // 모바일 메뉴 토글 기능 (모바일 뷰에서 필요할 경우)
  function setupMobileMenuToggle() {
    // 추후 모바일 메뉴 기능 구현 시 추가
  }

  // 초기화 함수 실행
  function init() {
    renderChart();
    setupNotificationEvents();
    setupPostItemEvents();
    setupSidebarEvents();
    setupProfileEditEvent();
    setupMobileMenuToggle();
  }

  // 모든 기능 초기화
  init();
});
