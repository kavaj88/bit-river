// 目录脚本 - 用于生成和交互文章目录
(function () {
  // 目录生成函数
    function generateTOC() {
      
        if (!window.location.pathname.startsWith("/posts/")) {
          return;
        }

    // 获取所有标题元素
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    // 调试：检查是否找到标题元素
    // console.log("找到的标题元素数量:", headings.length);

    // 如果没有标题，则不生成目录
    if (headings.length === 0) {
      // console.log("未找到标题元素，不生成目录");
      return;
    }

    // 检查是否已存在目录容器，如果存在则移除
    const existingTOC = document.querySelector(".toc-aside");
    if (existingTOC) {
      existingTOC.remove();
    }

    // 创建目录容器
    const tocContainer = document.createElement("aside");
    tocContainer.className = "toc-aside";

    // 创建目录标题
    const tocTitle = document.createElement("div");
    tocTitle.className = "toc-title";
    tocTitle.textContent = "目录";
    tocContainer.appendChild(tocTitle);

    // 创建目录列表
    const tocList = document.createElement("ul");
    tocList.className = "toc-list";
    tocContainer.appendChild(tocList);

    // 为每个标题创建目录项
    headings.forEach((heading, index) => {
      // 如果没有ID，则生成一个
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      // 创建目录项
      const tocItem = document.createElement("li");

      // 创建目录链接
      const tocLink = document.createElement("a");
      tocLink.href = `#${heading.id}`;
      tocLink.className = "toc-link";
      tocLink.textContent = heading.textContent.replace(/^#+\s*|\s*#+$/g, "");

      // 根据标题级别设置缩进
      const level = parseInt(heading.tagName.substring(1));
      tocLink.style.paddingLeft = `${(level - 1) * 10}px`;

      // 添加点击事件
      tocLink.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById(heading.id).scrollIntoView({
          behavior: "smooth",
        });

        // 更新活动链接
        document.querySelectorAll(".toc-link").forEach(link => {
          link.classList.remove("active");
        });
        tocLink.classList.add("active");
      });

      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
    });

    // 将目录添加到页面
    document.body.appendChild(tocContainer);

    // 调试：检查目录是否成功添加
    console.log("目录容器已添加到页面", tocContainer);

    // 滚动时更新活动链接
    updateActiveLinkOnScroll(headings);
  }

  // 滚动时更新活动链接的函数
  function updateActiveLinkOnScroll(headings) {
    // 移除之前的滚动事件监听器（如果有）
    window.removeEventListener("scroll", handleScroll);

    // 添加新的滚动事件监听器
    function handleScroll() {
      let currentHeading = "";

      headings.forEach(heading => {
        const sectionTop = heading.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
          currentHeading = heading.id;
        }
      });

      document.querySelectorAll(".toc-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentHeading}`) {
          link.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", handleScroll);
  }

  // 初始加载时生成目录
  document.addEventListener("DOMContentLoaded", generateTOC);

  // 监听Astro页面导航事件
  document.addEventListener("astro:page-load", generateTOC);

  // 监听Astro页面导航开始事件（可选，用于清理）
  document.addEventListener("astro:after-preparation", () => {
    const existingTOC = document.querySelector(".toc-aside");
    if (existingTOC) {
      existingTOC.remove();
    }
  });
})();
