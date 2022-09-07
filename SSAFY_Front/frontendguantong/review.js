document.addEventListener('DOMContentLoaded', function () {
  // 별점 선택 이벤트 리스너
  document.querySelector('.rating').addEventListener('click', function (e) {
    let elem = e.target;
    if (elem.classList.contains('rate_radio')) {
      rating.setRate(parseInt(elem.value));
    }
  })

  const review_tit = document.querySelector('#review_title'); // 제목에 입력한 값
  const review_con = document.querySelector('#review_con'); // 내용에 입력한 값

  // 리뷰 작성 글자수 초과 체크 이벤트 리스너
  document.querySelector('#review_con').addEventListener('keydown', function () {
    // 리뷰가 100자를 초과하지 않도록 자동 자름
    let lengthCheckEx = /^.{100,}$/;
    if (lengthCheckEx.test(review_con.value)) {
      // 100자 초과의 내용은 컷
      review_con.value = review_con.value.substr(0, 100);
    }
  });

  // 리뷰 전송 전 필드 체크 이벤트 리스너
  document.querySelector('#register').addEventListener('click', function (e) {
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

    const currVideoId = window.location.search.split("=")[1]

    let reviewData = localStorage.getItem("reviewData");
    reviewData = JSON.parse(reviewData);
    
    const review = {
      "reviewId": reviewData[currVideoId].reviewNum + 1,
      "title": review_tit.value,
      "content": review_con.value,
      "rate": rating.rate,
      "time": new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, ''),
    };

    reviewData[currVideoId].reviewNum += 1;
    reviewData[currVideoId].reviews.push(review);

    localStorage.setItem("reviewData", JSON.stringify(reviewData));

    alert("리뷰 등록 완료!");
    window.location.href = `http://127.0.0.1:5500/list.html?id=${currVideoId}`;
  });

  document.querySelector("#cancel").addEventListener("click", () => {
    const currVideoId = window.location.search.split("=")[1]
    const url = `http://127.0.0.1:5500/list.html?id=${currVideoId}`;
    window.location.replace(url);
  })
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