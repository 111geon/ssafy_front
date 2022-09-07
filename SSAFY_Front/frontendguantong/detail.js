const currVideoId = window.location.search.split("=")[1].split("&")[0];
const currReviewId = window.location.search.split("=")[2];
const reviews = JSON.parse(localStorage.getItem("reviewData"))[currVideoId].reviews
const url = `http://127.0.0.1:5500/list.html?id=${currVideoId}`;

window.addEventListener("load", () => {
    let currReview;
    for (review of reviews) {
        if (review.reviewId == currReviewId) {
            currReview = review;
            break;
        }
    }

    const cardTag = document.querySelector(".card");
    const html = `
    <div class="card-header">
        ${currReview.title}
    </div>
    <div class="card-body">
        <p>
        ${currReview.content}
        </p>
    </div>
    <div class="card-footer">
        별점 : ${"★".repeat(currReview.rate) + "☆".repeat(5-currReview.rate)}<br>
        작성시간 : ${currReview.time}
    </div>
    `
    cardTag.innerHTML += html;

  });

document.querySelector(".getback").addEventListener("click", () => {
    window.location.replace(url);
});

document.querySelector(".delete").addEventListener("click", () => {
    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].reviewId == currReviewId) {
            reviews.splice(i, i+1);
            break;
        }
    }
    let reviewData = JSON.parse(localStorage.getItem("reviewData"));
    reviewData[currVideoId].reviews = reviews;
    localStorage.setItem("reviewData", JSON.stringify(reviewData));
    window.alert("삭제되었습니다.");

    window.location.replace(url);
});

document.querySelector(".modify").addEventListener("click", () => {
    const modifyUrl = `http://127.0.0.1:5500/modify.html?videoId=${currVideoId}&reviewId=${currReviewId}`;
    window.location.replace(modifyUrl);
})
