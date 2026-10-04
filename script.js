/* =========================================================
   RAYYY COMMUNITY
   SCRIPT.JS
   ========================================================= */


/* ================= DEFAULT POSTS ================= */

const defaultPosts = [
  {
    id: 1,
    name: "Rayy",
    username: "@rayy",
    avatar: "R",
    avatarClass: "avatar-purple",
    verified: true,
    text: "Lagi bikin project baru 👀\nKayaknya bakal jadi sesuatu yang lumayan besar.",
    time: "12m",
    likes: 41,
    comments: 12,
    reposts: 7,
    liked: false,
    bookmarked: false,
    own: true
  },

  {
    id: 2,
    name: "Dimas",
    username: "@dimasdev",
    avatar: "D",
    avatarClass: "avatar-blue",
    verified: false,
    text: "Baru selesai ngulik JavaScript. Ternyata makin dipelajari makin banyak hal menarik wkwk.",
    time: "28m",
    likes: 24,
    comments: 8,
    reposts: 3,
    liked: false,
    bookmarked: false,
    own: false
  },

  {
    id: 3,
    name: "Naya",
    username: "@naya",
    avatar: "N",
    avatarClass: "avatar-pink",
    verified: true,
    text: "Menurut kalian, dark UI masih jadi pilihan terbaik untuk developer tools?",
    time: "1h",
    likes: 67,
    comments: 19,
    reposts: 5,
    liked: false,
    bookmarked: false,
    own: false
  },

  {
    id: 4,
    name: "Fajar",
    username: "@fajar",
    avatar: "F",
    avatarClass: "avatar-green",
    verified: false,
    text: "Weekend ini waktunya bikin sesuatu yang baru 🚀",
    time: "2h",
    likes: 31,
    comments: 4,
    reposts: 2,
    liked: false,
    bookmarked: false,
    own: false
  }
];


/* ================= STORAGE ================= */

const STORAGE_KEY =
  "rayyyCommunityPosts";


function loadPosts() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {

      return JSON.parse(saved);

    }

  } catch (error) {

    console.warn(
      "Could not load posts.",
      error
    );

  }

  return defaultPosts;

}


let posts = loadPosts();


function savePosts() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(posts)
    );

  } catch (error) {

    console.warn(
      "Could not save posts.",
      error
    );

  }

}


/* ================= DOM ================= */

const feed =
  document.getElementById("feed");

const bookmarkFeed =
  document.getElementById(
    "bookmarkFeed"
  );

const bookmarkEmpty =
  document.getElementById(
    "bookmarkEmpty"
  );

const profileFeed =
  document.getElementById(
    "profileFeed"
  );

const toast =
  document.getElementById("toast");


/* ================= UTILS ================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function showToast(message) {

  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(
    window.toastTimer
  );

  window.toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2000
    );

}


/* ================= RENDER POST ================= */

function renderPost(post) {

  const likedClass =
    post.liked
      ? "liked"
      : "";

  const bookmarkClass =
    post.bookmarked
      ? "bookmarked"
      : "";

  const verified =
    post.verified
      ? `<span class="verified">✓</span>`
      : "";

  return `

    <article
      class="post"
      data-post-id="${post.id}"
    >

      <div class="post-head">

        <div class="avatar ${post.avatarClass}">
          ${escapeHTML(post.avatar)}
        </div>

        <div class="post-user">

          <div class="post-user-line">

            <strong>
              ${escapeHTML(post.name)}
            </strong>

            ${verified}

            <span>
              ${escapeHTML(post.username)}
            </span>

            <span class="post-time">
              · ${escapeHTML(post.time)}
            </span>

          </div>

        </div>

        <button
          class="post-menu"
          data-action="menu"
          aria-label="Post menu"
        >
          •••
        </button>

      </div>


      <div class="post-body">
        ${escapeHTML(post.text)}
      </div>


      <div class="post-actions">

        <button
          class="post-action ${likedClass}"
          data-action="like"
          data-id="${post.id}"
        >
          <span>
            ${post.liked ? "♥" : "♡"}
          </span>

          <span class="count">
            ${post.likes}
          </span>

        </button>


        <button
          class="post-action"
          data-action="comment"
          data-id="${post.id}"
        >
          <span>
            ♧
          </span>

          <span class="count">
            ${post.comments}
          </span>

        </button>


        <button
          class="post-action"
          data-action="repost"
          data-id="${post.id}"
        >
          <span>
            ↻
          </span>

          <span class="count">
            ${post.reposts}
          </span>

        </button>


        <button
          class="post-action ${bookmarkClass}"
          data-action="bookmark"
          data-id="${post.id}"
        >
          <span>
            ${post.bookmarked ? "◆" : "◇"}
          </span>

        </button>

      </div>

    </article>

  `;

}


/* ================= RENDER FEEDS ================= */

function renderFeed(
  target,
  sourcePosts
) {

  if (!target) return;

  if (!sourcePosts.length) {

    target.innerHTML = "";

    return;

  }

  target.innerHTML =
    sourcePosts
      .map(renderPost)
      .join("");

}


function renderAll() {

  renderFeed(
    feed,
    posts
  );


  renderFeed(
    profileFeed,
    posts.filter(
      post => post.own
    )
  );


  const bookmarks =
    posts.filter(
      post => post.bookmarked
    );


  renderFeed(
    bookmarkFeed,
    bookmarks
  );


  if (bookmarkEmpty) {

    bookmarkEmpty.style.display =
      bookmarks.length
        ? "none"
        : "block";

  }


  const profilePosts =
    document.getElementById(
      "profilePosts"
    );

  if (profilePosts) {

    profilePosts.textContent =
      posts.filter(
        post => post.own
      ).length;

  }

}


/* ================= INITIAL RENDER ================= */

renderAll();


/* ================= POST ACTIONS ================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-action]"
      );

    if (!button) return;


    const action =
      button.dataset.action;


    const id =
      Number(button.dataset.id);


    if (action === "menu") {

      showToast(
        "Post menu coming soon."
      );

      return;

    }


    const post =
      posts.find(
        item => item.id === id
      );


    if (!post) return;


    if (action === "like") {

      post.liked =
        !post.liked;

      post.likes +=
        post.liked
          ? 1
          : -1;

      savePosts();

      renderAll();

      return;

    }


    if (action === "bookmark") {

      post.bookmarked =
        !post.bookmarked;

      savePosts();

      renderAll();

      showToast(
        post.bookmarked
          ? "Post saved."
          : "Removed from bookmarks."
      );

      return;

    }


    if (action === "repost") {

      post.reposts++;

      savePosts();

      renderAll();

      showToast(
        "Post reposted."
      );

      return;

    }


    if (action === "comment") {

      openCommentModal(
        post.id
      );

    }

  }
);


/* ================= CREATE MODAL ================= */

const createModal =
  document.getElementById(
    "createModal"
  );

const postText =
  document.getElementById(
    "postText"
  );

const charCount =
  document.getElementById(
    "charCount"
  );


function openCreateModal() {

  if (!createModal) return;

  createModal.classList.add(
    "active"
  );

  createModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  setTimeout(
    () => {

      postText?.focus();

    },
    100
  );

}


function closeCreateModal() {

  if (!createModal) return;

  createModal.classList.remove(
    "active"
  );

  createModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


[
  "openCreate",
  "mobileCreate",
  "headingCreate",
  "composerOpen",
  "composerSend"
].forEach(id => {

  const element =
    document.getElementById(id);

  if (element) {

    element.addEventListener(
      "click",
      openCreateModal
    );

  }

});


document
  .getElementById("closeCreate")
  ?.addEventListener(
    "click",
    closeCreateModal
  );


document
  .getElementById("cancelCreate")
  ?.addEventListener(
    "click",
    closeCreateModal
  );


createModal
  ?.querySelector(".modal-backdrop")
  ?.addEventListener(
    "click",
    closeCreateModal
  );


/* ================= CHARACTER COUNT ================= */

postText?.addEventListener(
  "input",
  () => {

    const length =
      postText.value.length;

    charCount.textContent =
      `${length} / 500`;

    if (length > 450) {

      charCount.style.color =
        "#ff9eae";

    } else {

      charCount.style.color =
        "";

    }

  }
);


/* ================= PUBLISH POST ================= */

document
  .getElementById("publishPost")
  ?.addEventListener(
    "click",
    () => {

      const text =
        postText.value.trim();


      if (!text) {

        showToast(
          "Tulis sesuatu dulu."
        );

        postText.focus();

        return;

      }


      const newPost = {

        id:
          Date.now(),

        name:
          "Rayy",

        username:
          "@rayy",

        avatar:
          "R",

        avatarClass:
          "avatar-purple",

        verified:
          true,

        text:
          text,

        time:
          "now",

        likes:
          0,

        comments:
          0,

        reposts:
          0,

        liked:
          false,

        bookmarked:
          false,

        own:
          true

      };


      posts.unshift(
        newPost
      );


      savePosts();

      renderAll();

      postText.value = "";

      charCount.textContent =
        "0 / 500";


      closeCreateModal();

      showToast(
        "Post published!"
      );

    }
  );


/* ================= COMMENT MODAL ================= */

const commentModal =
  document.getElementById(
    "commentModal"
  );

const comments =
  document.getElementById(
    "comments"
  );

const commentForm =
  document.getElementById(
    "commentForm"
  );

const commentInput =
  document.getElementById(
    "commentInput"
  );


let activeCommentPost =
  null;


/* Demo comments */

const commentData = {

  1: [
    {
      name: "Dimas",
      avatar: "D",
      avatarClass: "avatar-blue",
      text: "Keren, ditunggu update berikutnya!"
    },

    {
      name: "Naya",
      avatar: "N",
      avatarClass: "avatar-pink",
      text: "Penasaran bakal jadi apa 👀"
    }
  ],

  2: [
    {
      name: "Rayy",
      avatar: "R",
      avatarClass: "avatar-purple",
      text: "JavaScript memang rabbit hole wkwk."
    }
  ],

  3: [
    {
      name: "Fajar",
      avatar: "F",
      avatarClass: "avatar-green",
      text: "Dark UI masih juara sih."
    }
  ],

  4: []

};


function renderComments() {

  if (!comments) return;


  const data =
    commentData[
      activeCommentPost
    ] || [];


  if (!data.length) {

    comments.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ♧
        </div>

        <h3>
          No replies yet
        </h3>

        <p>
          Be the first to reply.
        </p>

      </div>

    `;

    return;

  }


  comments.innerHTML =
    data.map(
      comment => `

        <div class="comment">

          <div class="avatar ${comment.avatarClass}">
            ${escapeHTML(comment.avatar)}
          </div>

          <div class="comment-body">

            <strong>
              ${escapeHTML(comment.name)}
            </strong>

            <span>
              ${escapeHTML(comment.text)}
            </span>

          </div>

        </div>

      `
    ).join("");

}


function openCommentModal(id) {

  activeCommentPost =
    id;

  renderComments();

  commentModal.classList.add(
    "active"
  );

  commentModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  setTimeout(
    () => {

      commentInput?.focus();

    },
    100
  );

}


function closeCommentModal() {

  commentModal.classList.remove(
    "active"
  );

  commentModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  activeCommentPost =
    null;

}


document
  .getElementById("closeComments")
  ?.addEventListener(
    "click",
    closeCommentModal
  );


commentModal
  ?.querySelector(".modal-backdrop")
  ?.addEventListener(
    "click",
    closeCommentModal
  );


commentForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const text =
      commentInput.value.trim();


    if (!text) return;


    if (!commentData[activeCommentPost]) {

      commentData[
        activeCommentPost
      ] = [];

    }


    commentData[
      activeCommentPost
    ].push({

      name:
        "Rayy",

      avatar:
        "R",

      avatarClass:
        "avatar-purple",

      text:
        text

    });


    const post =
      posts.find(
        item =>
          item.id ===
          activeCommentPost
      );


    if (post) {

      post.comments++;

      savePosts();

      renderAll();

    }


    commentInput.value = "";

    renderComments();

    showToast(
      "Reply sent."
    );

  }
);


/* ================= FOLLOW ================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".follow-button"
      );

    if (!button) return;


    const name =
      button.dataset.follow;


    const following =
      button.classList.toggle(
        "following"
      );


    button.textContent =
      following
        ? "Following"
        : "Follow";


    showToast(
      following
        ? `Following ${name}.`
        : `Unfollowed ${name}.`
    );

  }
);


/* ================= PAGE NAVIGATION ================= */

const navItems =
  document.querySelectorAll(
    ".nav-item"
  );

const pages =
  document.querySelectorAll(
    ".page"
  );


function showPage(pageName) {

  pages.forEach(page => {

    page.classList.toggle(
      "active",
      page.id ===
        `page-${pageName}`
    );

  });


  navItems.forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.page ===
        pageName
    );

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


navItems.forEach(item => {

  item.addEventListener(
    "click",
    event => {

      event.preventDefault();

      showPage(
        item.dataset.page
      );

      closeMobileMenu();

    }
  );

});


/* ================= HASH NAVIGATION ================= */

function handleHash() {

  const hash =
    window.location.hash
      .replace("#", "");


  const validPages = [
    "home",
    "explore",
    "notifications",
    "bookmarks",
    "profile"
  ];


  if (
    validPages.includes(hash)
  ) {

    showPage(hash);

  } else {

    showPage("home");

  }

}


window.addEventListener(
  "hashchange",
  handleHash
);


handleHash();


/* ================= SEARCH ================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );


function searchPosts(value) {

  const query =
    value
      .trim()
      .toLowerCase();


  if (!query) {

    renderFeed(
      feed,
      posts
    );

    return;

  }


  const results =
    posts.filter(post => {

      return (
        post.text
          .toLowerCase()
          .includes(query) ||

        post.name
          .toLowerCase()
          .includes(query) ||

        post.username
          .toLowerCase()
          .includes(query)
      );

    });


  renderFeed(
    feed,
    results
  );


  if (!results.length) {

    feed.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⌕
        </div>

        <h3>
          Nothing found
        </h3>

        <p>
          Try searching for another word.
        </p>

      </div>

    `;

  }

}


searchInput?.addEventListener(
  "input",
  event => {

    searchPosts(
      event.target.value
    );

  }
);


/* ================= EXPLORE SEARCH ================= */

const exploreSearch =
  document.getElementById(
    "exploreSearch"
  );


exploreSearch?.addEventListener(
  "input",
  event => {

    const value =
      event.target.value
        .trim()
        .toLowerCase();


    if (!value) return;


    const matching =
      posts.filter(post =>
        post.text
          .toLowerCase()
          .includes(value)
      );


    showPage("home");

    renderFeed(
      feed,
      matching
    );

  }
);


/* ================= RIGHT SEARCH ================= */

const rightSearch =
  document.getElementById(
    "rightSearch"
  );


rightSearch?.addEventListener(
  "keydown",
  event => {

    if (
      event.key !==
      "Enter"
    ) {

      return;

    }


    const value =
      rightSearch.value;


    searchInput.value =
      value;


    showPage("home");

    searchPosts(value);

  }
);


/* ================= MOBILE MENU ================= */

const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );

const sidebar =
  document.querySelector(
    ".sidebar"
  );


function closeMobileMenu() {

  sidebar?.classList.remove(
    "open"
  );

}


mobileMenu?.addEventListener(
  "click",
  () => {

    sidebar?.classList.toggle(
      "open"
    );

  }
);


/* ================= ESCAPE ================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !==
      "Escape"
    ) {

      return;

    }


    closeCreateModal();

    closeCommentModal();

    closeMobileMenu();

  }
);


/* ================= DEMO SHORTCUT ================= */

console.log(
  "%c Rayyy Community ",
  "background:#8d7aff;color:white;padding:6px 10px;border-radius:6px;font-weight:bold;"
);

console.log(
  "Frontend V1 loaded successfully."
);