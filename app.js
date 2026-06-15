(() => {
  "use strict";

  const state = {
    activePage: "home",
    cart: JSON.parse(localStorage.getItem("hmb-cart") || "{}"),
    category: "All",
    productQuery: "",
    productSort: "featured",
    orderQuery: "",
    orderStatus: "all",
    currentPage: 1,
    rowsPerPage: 10,
    latestOrder: null,
    liveOrders: [...ORDERS],
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const currency = new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  });

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    $("#toastRegion").append(node);
    setTimeout(() => node.remove(), 3200);
  }

  function saveCart() {
    localStorage.setItem("hmb-cart", JSON.stringify(state.cart));
  }

  function cartEntries() {
    return Object.entries(state.cart)
      .map(([id, quantity]) => ({
        product: PRODUCTS.find((product) => product.id === id),
        quantity,
      }))
      .filter((entry) => entry.product && entry.quantity > 0);
  }

  function cartItemCount() {
    return cartEntries().reduce((total, item) => total + item.quantity, 0);
  }

  function cartTotal() {
    return cartEntries().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  function setPage(page, updateHash = true) {
    if (!document.querySelector(`[data-page="${page}"]`)) return;
    state.activePage = page;
    $$(".page").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.page === page);
    });
    $$("[data-page-link]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.pageLink === page);
    });
    if (updateHash) history.replaceState(null, "", `#${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeCart();
    if (page === "dashboard") renderOrders();
  }

  function productCard(product) {
    return `
      <article class="product-card">
        <div class="product-visual">
          <span aria-hidden="true">${product.icon}</span>
          <small class="product-badge">${product.badge}</small>
        </div>
        <div class="product-content">
          <div class="product-title-row">
            <h3>${product.name}</h3>
            <span>★ ${product.rating}</span>
          </div>
          <p>${product.description}</p>
          <div class="product-price-row">
            <div>
              <strong>${currency.format(product.price)}</strong>
              <span> · ${product.pieces} pcs</span>
            </div>
            <button class="add-button" data-add-product="${product.id}" aria-label="Add ${product.name} to cart">+</button>
          </div>
        </div>
      </article>`;
  }

  function renderFeatured() {
    $("#featuredGrid").innerHTML = PRODUCTS.slice(0, 3).map(productCard).join("");
  }

  function renderCategories() {
    const categories = ["All", ...new Set(PRODUCTS.map((product) => product.category))];
    $("#categoryFilters").innerHTML = categories
      .map(
        (category) =>
          `<button class="filter-pill ${state.category === category ? "is-active" : ""}" data-category="${category}">${category}</button>`,
      )
      .join("");
  }

  function renderProducts() {
    let products = PRODUCTS.filter((product) => {
      const categoryMatches =
        state.category === "All" || product.category === state.category;
      const query = state.productQuery.toLowerCase();
      const searchMatches =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return categoryMatches && searchMatches;
    });

    if (state.productSort === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (state.productSort === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (state.productSort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    $("#productGrid").innerHTML = products.length
      ? products.map(productCard).join("")
      : `<div class="empty-state">No dumplings match that search.</div>`;
  }

  function addProduct(id, quantity = 1) {
    state.cart[id] = (state.cart[id] || 0) + quantity;
    saveCart();
    renderCart();
    const product = PRODUCTS.find((item) => item.id === id);
    toast(`${product?.name || "Item"} added to your cart.`);
  }

  function updateCartItem(id, change) {
    state.cart[id] = (state.cart[id] || 0) + change;
    if (state.cart[id] <= 0) delete state.cart[id];
    saveCart();
    renderCart();
  }

  function cartMarkup() {
    const items = cartEntries();
    if (!items.length) {
      return `<div class="empty-state">Your cart is empty. Add a box and come back here.</div>`;
    }
    return items
      .map(
        ({ product, quantity }) => `
          <div class="cart-item">
            <span class="cart-item-icon" aria-hidden="true">${product.icon}</span>
            <div class="cart-item-info">
              <strong>${product.name}</strong>
              <small>${currency.format(product.price)} each</small>
            </div>
            <div class="quantity-control">
              <button data-cart-change="-1" data-cart-id="${product.id}" aria-label="Reduce quantity">−</button>
              <strong>${quantity}</strong>
              <button data-cart-change="1" data-cart-id="${product.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>`,
      )
      .join("");
  }

  function renderCart() {
    const count = cartItemCount();
    const total = currency.format(cartTotal());
    $("#cartCount").textContent = count;
    $("#desktopCartCount").textContent = `${count} item${count === 1 ? "" : "s"}`;
    $("#cartTotal").textContent = total;
    $("#desktopCartTotal").textContent = total;
    $("#cartItems").innerHTML = cartMarkup();
    $("#desktopCartItems").innerHTML = cartMarkup();
  }

  function openCart() {
    $("#cartDrawer").classList.add("is-open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    $("#cartDrawer").classList.remove("is-open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function setCheckoutStep(step) {
    $$("[data-checkout-step]").forEach((node) => {
      node.classList.toggle("is-active", Number(node.dataset.checkoutStep) === step);
    });
    $$("[data-step-indicator]").forEach((node) => {
      node.classList.toggle("is-active", Number(node.dataset.stepIndicator) <= step);
    });
  }

  function openCheckout() {
    if (!cartItemCount()) {
      toast("Add at least one dumpling box before checkout.");
      setPage("order");
      return;
    }
    closeCart();
    setCheckoutStep(1);
    $("#checkoutModal").classList.add("is-open");
    $("#checkoutModal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $("#checkoutDate").min = new Date().toISOString().slice(0, 10);
    $("#checkoutDate").value = tomorrow.toISOString().slice(0, 10);
  }

  function closeCheckout() {
    $("#checkoutModal").classList.remove("is-open");
    $("#checkoutModal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function validateDelivery() {
    const fields = [
      ["checkoutName", "Recipient name"],
      ["checkoutPhone", "Phone number"],
      ["checkoutAddress", "Delivery address"],
      ["checkoutZone", "Delivery zone"],
      ["checkoutDate", "Preferred date"],
    ];
    const missing = fields.filter(([id]) => !$( `#${id}` ).value.trim());
    $("#deliveryError").textContent = missing.length
      ? `Please complete: ${missing.map(([, label]) => label).join(", ")}.`
      : "";
    return missing.length === 0;
  }

  function renderCheckoutSummary() {
    const lines = cartEntries()
      .map(
        ({ product, quantity }) =>
          `<div><span>${product.name} × ${quantity}</span><strong>${currency.format(product.price * quantity)}</strong></div>`,
      )
      .join("");
    $("#checkoutSummary").innerHTML = `${lines}<div><strong>Total</strong><strong>${currency.format(cartTotal())}</strong></div>`;
  }

  function createOrder() {
    const now = new Date();
    const orderNo = `HMB-${String(now.getFullYear()).slice(-2)}${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
    const itemText = cartEntries()
      .map(({ product, quantity }) => `${product.name} × ${quantity}`)
      .join(", ");
    const payment = $('input[name="payment"]:checked').value;

    state.latestOrder = {
      orderNo,
      deliveryId: `DLY-${Math.floor(80000 + Math.random() * 19000)}`,
      orderDate: "15 Jun 2026",
      orderTime: new Intl.DateTimeFormat("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now),
      deliveryTime: "18:30",
      status: "Confirmed",
      items: itemText,
      settlement: payment === "Cash on Delivery" ? "Pending" : "Paid",
      total: cartTotal(),
    };

    state.liveOrders.unshift(state.latestOrder);
    $("#confirmationCopy").textContent = `We received your ${payment} confirmation. Keep this order number for tracking.`;
    $("#confirmationCode").textContent = orderNo;
    setCheckoutStep(3);
    state.cart = {};
    saveCart();
    renderCart();
  }

  function trackingSteps(status) {
    const steps = [
      {
        title: "Order confirmed",
        copy: "Payment and delivery details verified.",
        time: "10:08",
      },
      {
        title: "Packing",
        copy: "Frozen packs are being prepared and checked.",
        time: "11:20",
      },
      {
        title: "Shipped",
        copy: "Handed to the delivery partner.",
        time: "14:10",
      },
      {
        title: "Delivered",
        copy: "Arrived at the selected address.",
        time: "18:05",
      },
    ];
    const current = ORDER_STATUSES.indexOf(status);
    return steps
      .map((step, index) => {
        const complete = index <= current;
        const currentClass = index === current;
        return `
          <div class="timeline-step ${complete ? "is-complete" : ""} ${currentClass ? "is-current" : ""}">
            <span class="timeline-dot">${complete ? "✓" : index + 1}</span>
            <div class="timeline-copy">
              <strong>${step.title}</strong>
              <p>${step.copy}</p>
              <small>${complete ? step.time : "Waiting"}</small>
            </div>
          </div>`;
      })
      .join("");
  }

  function renderTracking(order) {
    if (!order) {
      $("#trackingResult").innerHTML = `
        <div class="empty-state">
          <h3>Order not found</h3>
          <p>Check the order number and try again.</p>
        </div>`;
      return;
    }

    $("#trackingResult").innerHTML = `
      <div class="tracking-head">
        <div>
          <p class="eyebrow">Order ${order.orderNo}</p>
          <h2>${order.status === "Delivered" ? "Delivered safely." : "Your order is moving."}</h2>
        </div>
        <span class="status-chip">${order.status}</span>
      </div>
      <div class="track-meta">
        <div><span>Delivery ID</span><strong>${order.deliveryId}</strong></div>
        <div><span>Estimated delivery</span><strong>${order.deliveryTime}</strong></div>
        <div><span>Items</span><strong>${order.items}</strong></div>
      </div>
      <div class="timeline">${trackingSteps(order.status)}</div>`;
  }

  function validateSellerForm(form) {
    let valid = true;
    $$("[required]", form).forEach((field) => {
      const container = field.closest("label");
      const error = $(".field-error", container);
      const missing =
        field.type === "checkbox" ? !field.checked : !field.value.trim();
      let message = "";
      if (missing) message = "This field is required.";
      if (!missing && field.type === "email" && !field.validity.valid) {
        message = "Enter a valid email address.";
      }
      if (!missing && field.name === "plan" && field.value.trim().length < 20) {
        message = "Add a little more detail (minimum 20 characters).";
      }
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  }

  function filteredOrders() {
    const query = state.orderQuery.toLowerCase();
    return state.liveOrders.filter((order) => {
      const statusMatch =
        state.orderStatus === "all" || order.status === state.orderStatus;
      const queryMatch = [
        order.orderNo,
        order.deliveryId,
        order.items,
        order.orderDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return statusMatch && queryMatch;
    });
  }

  function statusBadge(status) {
    return `<span class="status-chip">${status}</span>`;
  }

  function renderMetrics() {
    const delivered = state.liveOrders.filter((order) => order.status === "Delivered").length;
    const revenue = state.liveOrders.reduce((sum, order) => sum + order.total, 0);
    const pending = state.liveOrders.filter((order) => order.settlement === "Pending").length;
    const cards = [
      ["Total orders", state.liveOrders.length, "Simulated records"],
      ["Delivered", delivered, "Completed journeys"],
      ["Gross value", currency.format(revenue), "Across all records"],
      ["Settlement pending", pending, "Needs attention"],
    ];
    $("#metricGrid").innerHTML = cards
      .map(
        ([label, value, note]) =>
          `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`,
      )
      .join("");
  }

  function renderOrders() {
    const orders = filteredOrders();
    const pageCount = Math.max(1, Math.ceil(orders.length / state.rowsPerPage));
    state.currentPage = Math.min(state.currentPage, pageCount);
    const start = (state.currentPage - 1) * state.rowsPerPage;
    const pageOrders = orders.slice(start, start + state.rowsPerPage);

    $("#ordersTableBody").innerHTML = pageOrders
      .map(
        (order) => `
          <tr>
            <td><strong>${order.orderNo}</strong><small>${currency.format(order.total)}</small></td>
            <td>${order.deliveryId}</td>
            <td><strong>${order.orderDate}</strong><small>${order.orderTime}</small></td>
            <td>${order.deliveryTime}</td>
            <td>${order.items}</td>
            <td>${order.settlement}</td>
            <td>${statusBadge(order.status)}</td>
          </tr>`,
      )
      .join("");

    $("#mobileOrderList").innerHTML = pageOrders
      .map(
        (order) => `
          <article class="mobile-order-card">
            <div class="mobile-order-card-head">
              <div><strong>${order.orderNo}</strong><small>${order.deliveryId}</small></div>
              ${statusBadge(order.status)}
            </div>
            <p>${order.items}</p>
            <div class="mobile-order-card-row"><span>${order.orderDate} · ${order.orderTime}</span><strong>${currency.format(order.total)}</strong></div>
          </article>`,
      )
      .join("");

    const shownStart = orders.length ? start + 1 : 0;
    const shownEnd = Math.min(start + state.rowsPerPage, orders.length);
    $("#paginationInfo").textContent = `Showing ${shownStart}–${shownEnd} of ${orders.length}`;
    $("#pageNumber").textContent = `${state.currentPage} / ${pageCount}`;
    $("#prevPage").disabled = state.currentPage <= 1;
    $("#nextPage").disabled = state.currentPage >= pageCount;
    renderMetrics();
  }

  function exportCsv() {
    const headers = [
      "Order No",
      "Delivery ID",
      "Order Date",
      "Order Time",
      "Delivery Time",
      "Status",
      "Items",
      "Settlement",
      "Total",
    ];
    const rows = filteredOrders().map((order) => [
      order.orderNo,
      order.deliveryId,
      order.orderDate,
      order.orderTime,
      order.deliveryTime,
      order.status,
      order.items,
      order.settlement,
      order.total.toFixed(2),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hot-meal-bar-orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast("CSV export prepared.");
  }

  function quickReorder() {
    state.cart = { "chicken-chive": 1, "student-duo": 1 };
    saveCart();
    renderCart();
    setPage("order");
    toast("Your last student combo is ready in the cart.");
  }

  function initialiseTheme() {
    const saved = localStorage.getItem("hmb-theme");
    const preferred =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = preferred;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const pageLink = event.target.closest("[data-page-link]");
      if (pageLink) setPage(pageLink.dataset.pageLink);

      const addButton = event.target.closest("[data-add-product]");
      if (addButton) addProduct(addButton.dataset.addProduct);

      const cartChange = event.target.closest("[data-cart-change]");
      if (cartChange) {
        updateCartItem(
          cartChange.dataset.cartId,
          Number(cartChange.dataset.cartChange),
        );
      }

      if (event.target.closest("[data-close-cart]")) closeCart();
      if (event.target.closest("[data-close-checkout]")) closeCheckout();
    });

    $("#openCart").addEventListener("click", openCart);
    $("#checkoutButton").addEventListener("click", openCheckout);
    $("#desktopCheckout").addEventListener("click", openCheckout);
    $("#quickReorderHero").addEventListener("click", quickReorder);

    $("#productSearch").addEventListener("input", (event) => {
      state.productQuery = event.target.value;
      renderProducts();
    });

    $("#productSort").addEventListener("change", (event) => {
      state.productSort = event.target.value;
      renderProducts();
    });

    $("#categoryFilters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      renderCategories();
      renderProducts();
    });

    $("#toPayment").addEventListener("click", () => {
      if (!validateDelivery()) return;
      renderCheckoutSummary();
      setCheckoutStep(2);
    });

    $("#backToDelivery").addEventListener("click", () => setCheckoutStep(1));
    $("#confirmOrder").addEventListener("click", createOrder);

    $("#copyOrderNumber").addEventListener("click", async () => {
      if (!state.latestOrder) return;
      await navigator.clipboard.writeText(state.latestOrder.orderNo);
      toast("Order number copied.");
    });

    $("#trackNewOrder").addEventListener("click", () => {
      if (!state.latestOrder) return;
      closeCheckout();
      $("#trackInput").value = state.latestOrder.orderNo;
      renderTracking(state.latestOrder);
      setPage("track");
    });

    $("#trackForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const value = $("#trackInput").value.trim().toUpperCase();
      const order = state.liveOrders.find(
        (item) => item.orderNo.toUpperCase() === value,
      );
      renderTracking(order);
    });

    $("#sellerForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateSellerForm(event.currentTarget)) {
        toast("Please fix the highlighted application fields.");
        return;
      }
      toast("Application submitted. The Hot Meal Bar team will contact you.");
      event.currentTarget.reset();
    });

    $("#orderSearch").addEventListener("input", (event) => {
      state.orderQuery = event.target.value;
      state.currentPage = 1;
      renderOrders();
    });

    $("#statusFilter").addEventListener("change", (event) => {
      state.orderStatus = event.target.value;
      state.currentPage = 1;
      renderOrders();
    });

    $("#rowsPerPage").addEventListener("change", (event) => {
      state.rowsPerPage = Number(event.target.value);
      state.currentPage = 1;
      renderOrders();
    });

    $("#prevPage").addEventListener("click", () => {
      state.currentPage = Math.max(1, state.currentPage - 1);
      renderOrders();
    });

    $("#nextPage").addEventListener("click", () => {
      state.currentPage += 1;
      renderOrders();
    });

    $("#exportCsv").addEventListener("click", exportCsv);
    $("#refreshOrders").addEventListener("click", () => {
      state.liveOrders = [...ORDERS];
      state.currentPage = 1;
      renderOrders();
      toast("Simulated order data refreshed.");
    });

    $("#themeToggle").addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("hmb-theme", next);
    });

    $("#supportToast").addEventListener("click", () => {
      toast("Demo support request created for the KTF team.");
    });

    window.addEventListener("scroll", () => {
      $("#siteHeader").classList.toggle("is-scrolled", window.scrollY > 8);
    });

    window.addEventListener("hashchange", () => {
      setPage(location.hash.slice(1) || "home", false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCart();
        closeCheckout();
      }
    });
  }

  function initialiseReveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 },
    );
    $$(".reveal").forEach((node) => observer.observe(node));
  }

  function init() {
    initialiseTheme();
    renderFeatured();
    renderCategories();
    renderProducts();
    renderCart();
    renderTracking(ORDERS[7]);
    renderOrders();
    bindEvents();
    initialiseReveal();
    setPage(location.hash.slice(1) || "home", false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
