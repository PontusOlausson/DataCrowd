<template>
  <div id="app">
    <nav class="navbar navbar-default navbar-inverse navbar-static-top" role="navigation">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle"
            data-toggle="collapse"
            data-target="#navbar-brand-centered"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div
            v-on:click="redirect('/about')"
            class="navbar-brand navbar-brand-centered"
            style="line-height: 1em; cursor: pointer;"
          >Om arbetet</div>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-brand-centered">
          <ul class="nav navbar-nav">
            <li v-on:click="redirect('/login')">
              <a style="cursor: pointer;">Login</a>
            </li>
            <li v-on:click="redirect('/genUttr')">
              <a style="cursor: pointer;">Generera replik</a>
            </li>
            <li v-on:click="redirect('/judge')">
              <a style="cursor: pointer;">Bedöm repliker</a>
            </li>
            <li v-on:click="redirect('/sysres')">
              <a style="cursor: pointer;">Välj systemsvar</a>
            </li>
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
      <!-- /.container-fluid -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>

<style>
.html,
body {
  margin: 0;
  padding: 0;
  border: 0;
}

span.text-blue {
  color: #387eff;
}

button:focus {
  outline: 0;
}

.navbar .container {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  width: 100%;
}

.navbar-brand-centered {
  position: absolute;
  left: 50%;
  display: block;
  width: 160px;
  text-align: center;
  background-color: transparent;
}

.navbar > .container .navbar-brand-centered,
.navbar > .container-fluid .navbar-brand-centered {
  margin-left: -80px;
}

.navbar {
  border-bottom: 0;
}

.navbar-default .navbar-nav > li:not(.active) > a:not(.unresponsive):hover {
  background-color: #0e0e0e;
}

.navbar-default .navbar-nav > .active > a,
.navbar-default .navbar-nav > .active > a:focus {
  background-color: #3873ff;
  color: #ffffff;
}

.navbar-default .navbar-nav > .active > a:hover {
  background-color: #1c65eb;
}

.nav.navbar-nav.navbar-right > li > .unresponsive:hover {
  color: #777777;
  cursor: default;
}

div.light-blue-background {
  background-color: #c5e7ff;
}

.dialogueTurn {
}

.userUtterance {
  text-align: left;
}

.systemUtterance {
  text-align: left;
  color: green;
}

.status-error-true {
  color: red;
}

.status-error-false {
  color: green;
}

.flexBoxLogin {
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.flexBoxLogin > * {
  margin: 0 0 0 15px;
}

.loginForm {
  display: flex;
  margin: 0 0 0 25 px;
}

.utteranceContainer {
  display: flex;
  justify-content: space-between;
}

.templateButton {
  text-align: center;
  margin-bottom: 0px !important;
  height: 60px;
  display: flex;
  align-items: center; /* Vertical center alignment */
  justify-content: center;
}

.templateButton:hover{
  background-color: #5cb85c;
  color: white;
}

.guideText {
  text-align: left;
}
</style>
