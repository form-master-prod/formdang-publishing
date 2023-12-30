const redirectToAnswerStatusList = () => {

  const urlParams = new URLSearchParams(window.location.search);
  const fidValue = urlParams.get('fid');

  if (!fidValue) {
    alert("이동할 페이지가 없습니다.");
    return;
  }

  const newURL = `answer_status_list.html?fid=${fidValue}`;
  location.href = newURL
};

document.addEventListener('DOMContentLoaded', () => {
  const anchorElement = document.getElementById('answer_status');
  anchorElement.addEventListener('click', redirectToAnswerStatusList);
});
