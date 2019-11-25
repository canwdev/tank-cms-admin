<template>
  <div class="page page-404">
    <div class="wrapper">
      <h1>404!</h1>
      <p class="summary">页面，我找不到你，我找不到你啊～</p>
      <a class="button" href="/">返回首页</a>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.4;
  }

  .wrapper {
    padding-right: 378px;
    background-size: 278px;
    background-position: right;
    background-repeat: no-repeat;
  }

  .page-404 .wrapper {
    background-image: url("~@/assets/images/error-404.png");
  }

  .page-500 .wrapper {
    background-image: url("~@/assets/images/error-500.png");
  }

  h1 {
    margin: 0;
    color: #4f565f;
    font-size: 120px;
    font-weight: bold;
  }

  a {
    text-decoration: none;
  }

  .summary {
    margin-top: 0;
    margin-bottom: 40px;
    color: #76808e;
    font-size: 24px;
  }

  .button {
    display: inline-block;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
    -webkit-transition: all .1s ease;
    transition: all .1s ease;
    border: 1px solid #323a45;
    background-color: #323a45;
    color: #fff;
    font-size: 18px;
    padding: 0 30px;
    height: 48px;
    line-height: 46px;
  }

  .button:hover {
    background-color: #425063;
    border: 1px solid #425063;
  }
</style>

