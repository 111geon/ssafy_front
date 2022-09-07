window.addEventListener("load", () => {
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = responseMsg
  xhr.open("GET", "./data/video.json", true)
  xhr.send()
});

function responseMsg() {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      jsonData = JSON.parse(xhr.responseText);
      const target_id = window.location.search.split("=")[1];

      let data;
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id === target_id) {
          data = jsonData[i].url;
        }
      }
      showVideo(data);

      const aTag = document.createElement("a");
      aTag.setAttribute("href", `http://127.0.0.1:5500/review.html?id=${target_id}`);
      aTag.innerText = "글 작성";
      document.querySelector('.make').appendChild(aTag);

      console.log(localStorage.getItem("reviewData"));

      const reviews = JSON.parse(localStorage.getItem("reviewData"))[target_id].reviews;
      const tableTag = document.querySelector(".table-rows");


      for (review of reviews) {
        const row = `
          <tr>
          <th scope="row">${review.reviewId}</th>
          <td class="finger"><a href="http://127.0.0.1:5500/detail.html?videoId=${target_id}&reviewId=${review.reviewId}">${review.title}</a></td>
          <td>${"★".repeat(review.rate) + "☆".repeat(5-review.rate)}</td>
          <td>${review.time}</td>
          </tr>
        `
        tableTag.innerHTML += row;
      }

    }
    else {
      console.log("데이터 수신 실패");
    }
  }
}

function showVideo(data) {
  document.querySelector('.video').innerHTML =
    `
  <iframe width="560" height="315" src="${data}" title="YouTube video player"
  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
`
}

function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;
  second = second >= 10 ? second : '0' + second;

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
