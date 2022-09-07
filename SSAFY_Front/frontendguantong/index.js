const popularTag = document.querySelector("#popular");
const partTag = document.querySelector("#part");
let jsonData = [];
let iPopular = 0;
let iPart = 0;
let currPart = "전신";
let reviewData;

window.addEventListener("load", () => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = responseMsg
    xhr.open("GET", "./data/video.json", true)
    xhr.send()
});

document.querySelector("#title-btn").addEventListener("click", searchTitle);
document.querySelector("#title-input").addEventListener("keyup", (event) => {
    if (event.code == "Enter") searchTitle();
});

document.querySelector("#btn-all").addEventListener("click", () => {
    currPart = "전신";
    createPartVideo(jsonData);
});
document.querySelector("#btn-upper").addEventListener("click", () => {
    currPart = "상체";
    createPartVideo(jsonData)
});
document.querySelector("#btn-lower").addEventListener("click", () => {
    currPart = "하체";
    createPartVideo(jsonData)
});
document.querySelector("#btn-abs").addEventListener("click", () => {
    currPart = "복부";
    createPartVideo(jsonData)
});

document.querySelector("#popular-left").addEventListener("click", () => {
    if (iPopular <= 0) return;
    iPopular -= 1;
    createPopularVideo(jsonData);
});
document.querySelector("#popular-right").addEventListener("click", () => {
    iPopular += 1;
    createPopularVideo(jsonData);
});
document.querySelector("#part-left").addEventListener("click", () => {
    if (iPart <= 0) return;
    iPart -= 1;
    createPartVideo(jsonData);
});
document.querySelector("#part-right").addEventListener("click", () => {
    iPart += 1;
    createPartVideo(jsonData);
});

function searchTitle() {

}

function responseMsg() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            jsonData = JSON.parse(xhr.responseText);
            for (let i = 0; i < jsonData.length; i++) {
                jsonData[i].clicks = 0;
            }
            createPopularVideo(jsonData);
            createPartVideo(jsonData);

            reviewData = JSON.parse(localStorage.getItem("reviewData"));
            if (reviewData == null) {
                reviewData = {};
                for (video of jsonData) {
                    reviewData[video.id] = {"reviewNum": 0, "reviews": []};
                }
            }

            localStorage.setItem("reviewData", JSON.stringify(reviewData));
        }
        else {
            console.log("데이터 수신 실패");
        }
    }
}

function createPopularVideo(jsonData) {
    popularTag.innerHTML = '';
    jsonData.sort(function(a, b) {
        return b.clicks - a.clicks;
    });

    for (let i = iPopular; i < iPopular + 3 ; i++) {
        popularTag.appendChild(createCardElement(jsonData[i%jsonData.length]));
    }
}

function createPartVideo(jsonData) {
    partTag.innerHTML = '';
    partData = jsonData.filter(data => data.part === currPart)
    for (let i = iPart; i < iPart + 3 ; i++) {
        partTag.appendChild(createCardElement(partData[i%partData.length]));
    }
}

function createCardElement(data) {
    const aTag = `<a href="http://127.0.0.1:5500/list.html?id=${data.id}">${data.title}</a>`;
    const html = `
        <div class="card d-flex flex-column bd-highlight w-100" id="video">
            <iframe style="height: 300px;" src="${data.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="d-flex justify-content-between">
                <div style="white-space: nowrap; overflow: hidden;">${aTag}</div>
                <div style="width:50px; text-align:right">
                    <i class="bi bi-eye"></i>
                    <span>${data.clicks}</span>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <span style="color: grey">${data.part}</span>
                <span style="color: grey">${data.channelName}</span>
            </div>
        </div>
    `
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
}
