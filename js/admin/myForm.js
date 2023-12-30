const redirectToAnswerStatusList = () => {

  const urlParams = new URLSearchParams(window.location.search);
  const fidValue = urlParams.get('fid');

  if (!fidValue) {
    alert("이동할 페이지가 없습니다.");
    return;
  }

  const newURL = `answer_status_list.html?fid=${fidValue}`;
  window.open(newURL, '_blank');  // 새 창에서 페이지 열기
};

document.addEventListener('DOMContentLoaded', () => {
  const anchorElement = document.getElementById('answer_status');
  anchorElement.addEventListener('click', redirectToAnswerStatusList);
});
