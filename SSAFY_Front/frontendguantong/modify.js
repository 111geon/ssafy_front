const currVideoId = window.location.search.split("=")[1].split("&")[0];
const currReviewId = window.location.search.split("=")[2];
const reviewData = JSON.parse(localStorage.getItem("reviewData"));
const url = `http://127.0.0.1:5500/detail.html?videoId=${currVideoId}&reviewId=${currReviewId}`;

const review_tit = document.querySelector('.review_title'); // 제목에 입력한 값
const review_con = document.querySelector('.review_con'); // 내용에 입력한 값
let currReview;
let currReviewIdx;

document.querySelector("#cancel").addEventListener("click", () => {
  window.location.replace(url);
})

document.addEventListener('DOMContentLoaded', function () {
  const reviews = reviewData[currVideoId].reviews;
  for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].reviewId == currReviewId) {
          currReview = reviews[i];
          currReviewIdx = i;
          break;
      }
  }

  rating.setRate(currReview.rate);
  document.querySelector(".review_title").innerText = currReview.title;
  document.querySelector(".review_con").innerText = currReview.content;

  // 별점 선택 이벤트 리스너
  document.querySelector('.rating').addEventListener('click', function (e) {
    let elem = e.target;
    if (elem.classList.contains('rate_radio')) {
      rating.setRate(parseInt(elem.value));
    }
  })

  // 리뷰 작성 글자수 초과 체크 이벤트 리스너
  document.querySelector('.review_con').addEventListener('keydown', function () {
    // 리뷰거 100자를 초과하지 않도록 자동 자름
    let review = document.querySelector('.review_con');
    let lengthCheckEx = /^.{100,}$/;
    if (lengthCheckEx.test(review.value)) {
      // 100자 초과의 내용은 컷
      review.value = review.value.substr(0, 100);
    }
  });

  // 리뷰 전송 전 필드 체크 이벤트 리스너
  document.querySelector('#modify').addEventListener('click', function (e) {

    // 별점을 선택하지 않았으면 메시지 표시
    if (rating.rate == 0) {
      rating.showMessage('rate');
      return false;
    }
    // 제목과 내용이 작성되지 않았으면 메시지 표시
    if (review_tit.value.length < 1 || review_con.value.length < 1) {
      rating.showMessage('review');
      return false;
    }

    reviewData[currVideoId].reviews[currReviewIdx].title = review_tit.value;
    reviewData[currVideoId].reviews[currReviewIdx].content = review_con.value;
    reviewData[currVideoId].reviews[currReviewIdx].rate = rating.rate;
    reviewData[currVideoId].reviews[currReviewIdx].time = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');

    localStorage.setItem("reviewData", JSON.stringify(reviewData));

    alert("리뷰 수정 완료!");
    window.location.href = url;
    
  });
});


// 별점 마킹 
function Rating() { };
Rating.prototype.rate = 0;
Rating.prototype.setRate = function (newrate) {
  // 클릭한 별 이하의 모든 별 체크하도록 처리
  this.rate = newrate;
  document.querySelector('.ratefill').style.width = parseInt(newrate * 50) + 'px';
  let items = document.querySelectorAll('.rate_radio');
  items.forEach(function (item, idx) {
    if (idx < newrate) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  });
}

// 메시지 표시
Rating.prototype.showMessage = function (type) {
  switch (type) {
    case 'rate':
      // 안내메시지 표시
      document.querySelector('.review_rating .warning_msg').style.display = 'block';
      // 지정된 시간 후 안내 메시지 감춤
      setTimeout(function () {
        document.querySelector('.review_rating .warning_msg').style.display = 'none';
      }, 1500);
      break;
    case 'review':
      // 안내메시지 표시
      document.querySelector('.review_contents .warning_msg').style.display = 'block';
      // 지정된 시간 후 안내 메시지 감춤
      setTimeout(function () {
        document.querySelector('.review_contents .warning_msg').style.display = 'none';
      }, 1500);
      break;
  }
}

let rating = new Rating();