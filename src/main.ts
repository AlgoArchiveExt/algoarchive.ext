document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('github-signin'); // Use id for the button
  if (button) {
    button.addEventListener('click', () => {
      let url = "https://github.com/login/oauth/authorize?client_id=Ov23liyoaQCz1BeILe7M&scope=repo";
    });
  }
});